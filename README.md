# Finance Guide 🇮🇳 💰

Finance Guide is a free, AI-powered personal budget planner built specifically for Indian households. It helps users calculate personalized monthly budget breakdowns, provides actionable financial coaching via Google's Gemini AI, and generates step-by-step roadmaps to reach financial stability.

## 📸 Screenshots

| 01 — Landing Page |
| :---: |
| <img width="1901" height="864" alt="Screenshot 2026-04-21 193350" src="https://github.com/user-attachments/assets/6b6b69e4-dd80-4c66-9159-65d335364b27" />| 

| 02 — User Input Section |
| :---: |
|<img width="1898" height="866" alt="Screenshot 2026-04-21 183956" src="https://github.com/user-attachments/assets/1c81840d-d934-45d4-ad20-f2df4e8d2d99" />|

|<img width="1896" height="865" alt="Screenshot 2026-04-21 184012" src="https://github.com/user-attachments/assets/2c312ddc-21b5-41f9-9cac-35bffda46a3f" />|

| 03 — Debt Portfolio Analysis |
| :---: |
|<img width="1899" height="860" alt="Screenshot 2026-04-21 184038" src="https://github.com/user-attachments/assets/bc703f27-ca20-4888-b046-0cfbd69bc612" />|

| 04 — Budget Breakdown |
| :---: |
|<img width="1894" height="863" alt="Screenshot 2026-04-21 184101" src="https://github.com/user-attachments/assets/0efabb7b-4279-4e70-bd86-a4283561f7c5" />|

| 05 — Govrnment Scheme Matcher |
| :---: |
|<img width="1900" height="868" alt="Screenshot 2026-04-21 184201" src="https://github.com/user-attachments/assets/5cf29fa2-386c-4abb-9220-87d552cb9c65" />|

| 06 — AI Financial Coach |
| :---: |
|<img width="1900" height="860" alt="Screenshot 2026-04-21 184222" src="https://github.com/user-attachments/assets/ec93247c-d4e4-47ad-868e-178bf8ff80c0" />|

| 07 — Poverty Escape Roadmap |
| :---: |
|<img width="1882" height="853" alt="image" src="https://github.com/user-attachments/assets/d7ca6e14-0951-42c0-9190-744f19bb7ee7" />|

|<img width="1899" height="863" alt="Screenshot 2026-04-21 184238" src="https://github.com/user-attachments/assets/7d0fb2c4-cff0-4a86-a863-7bbb71cac19d" />|

## ✨ Features

- **Personalized Budget Calculator**: Input your salary, city, family size, housing, and transport to get a highly accurate, weighted allocation of your income across essential categories.
- **🏛️ Government Scheme Matcher**: Discover eligible Indian government schemes based on your exact demographic profile with AI-simplified explanations.
- **🎯 Risk-adjusted Savings Goals**: Plan investments based on Safe, Moderate, or Aggressive risk profiles tailored to your calculated budget.
- **AI Financial Coach**: Powered by Google's Gemini 2.5 Flash Lite API. Ask questions about your budget in plain language and get jargon-free, personalized advice.
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

```
Finance-guide/
├── public/                     # Static assets, OpenGraph images, and PWA manifest
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── ask-gemini/     # Server-side endpoint protecting the Gemini API key
│   │   ├── blog/               # Dynamic blog engine with SEO metadata
│   │   ├── components/         # Core UI components (BudgetForm, AiCoach, Navbar, etc.)
│   │   ├── faqs/               # FAQ pages with structured JSON-LD
│   │   ├── lib/                # Utilities (AI client router, budget algorithms, PDF exporter)
│   │   └── types/              # Global TypeScript interfaces
│
└── next.config.ts             # Core Web Vitals optimization policies
```


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
