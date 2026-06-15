/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for optimized Docker builds
  output: 'standalone',

  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    const BASE = process.env.BASE_URL || '';
    if (!BASE) return [];
    const normalizedBase = BASE.replace(/\/api\/v1\/?$/i, '').replace(/\/$/, '');
    return [
      {
        source: '/api/v1/:path*',
        destination: `${normalizedBase}/api/v1/:path*`,
      },
    ];
  },
  reactStrictMode: false, //Disabled because of fluent 2 popover issue
  env: {
    BASE_URL: process.env.BASE_URL,
    BASE_URL_NEXT_AUTH: process.env.BASE_URL_NEXT_AUTH,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    TENANT_ID: process.env.TENANT_ID,
    CLIENT_SECRETS: process.env.CLIENT_SECRETS,
    CLIENT_ID_OUTLOOK: process.env.CLIENT_ID_OUTLOOK,
    CLIENT_SECRETS_OUTLOOK: process.env.CLIENT_SECRETS_OUTLOOK,
    APPLICATIONINSIGHTS_CONNECTION_STRING: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
    ApplicationInsightsAgent_EXTENSION_VERSION:
      process.env.ApplicationInsightsAgent_EXTENSION_VERSION,
    XDT_MicrosoftApplicationInsights_Mode: process.env.XDT_MicrosoftApplicationInsights_Mode,
    NEXT_PUBLIC_AZURE_SPEECH_KEY: process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY,
    NEXT_PUBLIC_AZURE_SPEECH_REGION: process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION,
  },
};

export default nextConfig;
