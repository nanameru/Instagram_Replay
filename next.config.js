/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  env: {
    INSTAGRAM_ACCESS_TOKEN: process.env.INSTAGRAM_ACCESS_TOKEN || "",
    INSTAGRAM_APP_TOKEN: process.env.INSTAGRAM_APP_TOKEN || "",
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  },
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
