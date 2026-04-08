import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Key is only accessible server-side — never sent to browser
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Simple in-memory rate limiter — max 10 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 10;

  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "unknown";

    // Check per-IP rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error:
            "Too many requests. Please wait a minute before trying again.",
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Invalid request. Prompt is required." },
        { status: 400 }
      );
    }

    // Limit prompt length to prevent abuse
    if (prompt.length > 4000) {
      return NextResponse.json(
        { error: "Prompt too long." },
        { status: 400 }
      );
    }

    // Call Gemini server-side
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);

    if (errMsg.includes("429") || errMsg.includes("quota")) {
      return NextResponse.json(
        {
          error:
            "⏳ The AI is busy right now. Please wait 1 minute and try again.",
        },
        { status: 429 }
      );
    }

    console.error("Gemini API error:", errMsg);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

// Block all non-POST requests
export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
