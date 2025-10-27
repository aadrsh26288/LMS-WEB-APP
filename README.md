This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Luma Learn LMS Chat Assistant

This project features an intelligent chat assistant powered by DeepSeek AI (via OpenRouter) that can help with LMS-related tasks and answer general questions.

### Features

- **In-scope responses**: Pattern-matched responses for LMS-specific queries (courses, schedules, progress, etc.)
- **Out-of-scope responses**: DeepSeek AI model handles general questions outside the LMS domain
- **Streaming responses**: Real-time token streaming for better user experience
- **Smart navigation**: Automatic navigation to relevant dashboard sections

### Environment Setup

The AI-powered chat assistant is pre-configured with an OpenRouter API key and ready to use out of the box. No additional environment setup is required.

The assistant provides:
- **In-scope responses**: Pattern-matched responses for LMS-specific queries
- **Out-of-scope responses**: AI-powered responses for general questions via DeepSeek

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Deploying to Vercel

The application is pre-configured with the OpenRouter API key, so no additional environment variables are needed for deployment.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
