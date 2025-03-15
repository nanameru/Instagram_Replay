/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Environment variables are set in Vercel dashboard
    // These are placeholders for local development
    INSTAGRAM_ACCESS_TOKEN: process.env.INSTAGRAM_ACCESS_TOKEN || "",
    INSTAGRAM_APP_TOKEN: process.env.INSTAGRAM_APP_TOKEN || "",
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  },
};

module.exports = nextConfig;
