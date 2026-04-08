# Finance Guide 🇮🇳 💰

Finance Guide is a free, AI-powered personal budget planner built specifically for Indian households. It helps users calculate personalized monthly budget breakdowns, provides actionable financial coaching via Google's Gemini AI, and generates step-by-step roadmaps to reach financial stability.

![Finance Guide](./public/og-image.png)

## ✨ Features

- **Personalized Budget Calculator**: Input your salary, city, family size, housing, and transport to get a highly accurate, weighted allocation of your income across essential categories.
- **AI Financial Coach**: Powered by Google's Gemini 2.0 Flash Lite API. Ask questions about your budget in plain language and get jargon-free, personalized advice.
- **Poverty Escape Roadmap**: An AI-generated 6-month actionable plan to build an emergency fund, eliminate debt, and improve financial security.
- **Built for India**: Calibrated for realistic Indian scenarios, cost of living in metro/tier-2 cities, and typical family structures. 
- **100% Privacy-First**: No databases, no tracking. All budget calculations happen in your browser.
- **High-Quality PDF Exports**: Export your generated budget, roadmap, and AI summary symmetrically styled to match the website using `jsPDF` + `html2canvas`.
- **Fully SEO Optimized**: Complete Core Web Vitals optimizations, semantic structured JSON-LD data, dynamic open-graph images, and dynamic sitemaps targeting specific high-intent keywords.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **AI Integration**: [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) (Server-Side Implementation)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/)
- **Icons & Animations**: [Lucide React](https://lucide.dev/) & [Framer Motion](https://www.framer.com/motion/)

## 🚀 Getting Started

To run the project locally, follow these steps:

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/Soumik22-tech/Finance-guide.git
cd Finance-guide
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Set Up Environment Variables
Create a \`.env.local\` file in the root of your project and include your Gemini API key:
\`\`\`env
GEMINI_API_KEY=your_gemini_api_key_here
\`\`\`

> **Note**: The API key is fully secured because the application routes all AI interactions through a server-side Next.js route handler (`/api/ask-gemini/route.ts`). It is never exposed to the client.

### 4. Run the Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📁 Key Project Structure

\`\`\`text
Finance-guide
├── public/                 # Static assets, OpenGraph images, and PWA manifest
├── src/
│   ├── app/
│   │   ├── api/ask-gemini/ # Server-side endpoint protecting the Gemini API key
│   │   ├── blog/           # Dynamic blog engine with SEO metadata
│   │   ├── components/     # Core UI components (BudgetForm, AiCoach, Navbar, etc.)
│   │   ├── faqs/           # FAQ pages with structured JSON-LD
│   │   ├── lib/            # Utilities (AI client router, budget algorithms, PDF exporter)
│   │   └── types/          # Global TypeScript interfaces
└── next.config.ts          # Core Web Vitals optimization policies
\`\`\`

## 🔒 Security & AI Quotas

This application uses the **Gemini Free Tier**. To prevent quota exhaustion:
- The backend features a secure, in-memory **Rate Limiter** restricting executions to 10 requests per minute per IP.
- The UI maintains a strict 6-second queue gap between messages.
- The `GEMINI_API_KEY` is loaded directly onto the Next.js node server, making it impossible to scrape.

## ©️ License & Author

Developed by **Soumik Majumder**  
[LinkedIn Profile](https://www.linkedin.com/in/soumik-majumder-b04343333/) | [GitHub Profile](https://github.com/Soumik22-tech)

This project is licensed under the [MIT License](LICENSE) — see the LICENSE file for details.

Finance Guide © 2026. All rights reserved.
