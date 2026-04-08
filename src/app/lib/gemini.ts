// Minimum gap between requests from this browser tab (6 seconds)
const MIN_REQUEST_GAP_MS = 6000;
let lastRequestTime = 0;
let requestQueue: Promise<unknown> = Promise.resolve();

async function waitForSlot(): Promise<void> {
  const now = Date.now();
  const timeSinceLast = now - lastRequestTime;
  if (timeSinceLast < MIN_REQUEST_GAP_MS) {
    await new Promise((res) =>
      setTimeout(res, MIN_REQUEST_GAP_MS - timeSinceLast)
    );
  }
  lastRequestTime = Date.now();
}

async function executeRequest(prompt: string): Promise<string> {
  await waitForSlot();

  const response = await fetch("/api/ask-gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }

  return data.text;
}

export async function askGemini(prompt: string): Promise<string> {
  // Chain all requests — only one runs at a time, others wait in queue
  const request = requestQueue.then(async () => {
    try {
      return await executeRequest(prompt);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);

      if (errMsg.includes("429") || errMsg.includes("busy")) {
        return "⏳ The AI is busy right now. Please wait 1 minute and try again.";
      }

      console.error("Request error:", errMsg);
      return "Sorry, something went wrong. Please try again.";
    }
  });

  requestQueue = request.then(() => {}, () => {});
  return request;
}
