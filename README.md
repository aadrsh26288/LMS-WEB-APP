This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Luma Learn LMS Chat Assistant

This project features an intelligent chat assistant powered by DeepSeek AI (via OpenRouter) that can help with LMS-related tasks and answer general questions.

### Features

- **In-scope responses**: Pattern-matched responses for LMS-specific queries (courses, schedules, progress, etc.)
- **Out-of-scope responses**: DeepSeek AI model handles general questions outside the LMS domain
- **Streaming responses**: Real-time token streaming for better user experience
- **Smart navigation**: Automatic navigation to relevant dashboard sections

### Environment Setup

To enable the AI-powered chat assistant for general questions, you need to configure an OpenRouter API key:

1. **Get an API key**:
   - Visit [https://openrouter.ai/keys](https://openrouter.ai/keys)
   - Sign up or log in to your account
   - Create a new API key

2. **Configure the environment variable**:
   - Create a `.env.local` file in the root directory (you can copy from `.env.local.example`)
   - Add your API key:
     ```bash
     OPENROUTER_API_KEY=your_openrouter_api_key_here
     ```

3. **Restart the development server** if it's already running

> **Note**: Without the API key, the assistant will only answer LMS-specific questions using pre-defined responses. General questions (like "what is javascript") will show a configuration error message.

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

### Setting up Environment Variables on Vercel

After deploying your project to Vercel, you need to configure the required environment variables:

1. Go to your project's dashboard on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add the following environment variable:
   - **Key**: `OPENROUTER_API_KEY`
   - **Value**: Your OpenRouter API key (get one from [openrouter.ai](https://openrouter.ai/))
   - **Environment**: Select all environments (Production, Preview, Development)
4. Click **Save**
5. Redeploy your application for the changes to take effect

> **Note**: The OpenRouter API key is required for the AI chat assistant to work. Without it, the assistant will fall back to predefined responses for LMS-related queries only.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
