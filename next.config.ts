const isDevelopment = process.env.NODE_ENV !== "production";

const cspHeader = `
  default-src 'self' resolved-halibut-83.accounts.dev resolved-halibut-83.clerk.accounts.dev cdn.jsdelivr.net js.sentry-cdn.com browser.sentry-cdn.com *.ingest.sentry.io challenges.cloudflare.com scdn.clerk.com segapi.clerk.com;
  script-src 'self' 'unsafe-inline' ${
    isDevelopment ? "'unsafe-eval'" : ""
  } https://resolved-halibut-83.clerk.accounts.dev https://challenges.cloudflare.com https://clerk.accounts.dev;
  script-src-elem 'self' 'unsafe-inline' ${
    isDevelopment ? "'unsafe-eval'" : ""
  } https://resolved-halibut-83.clerk.accounts.dev https://challenges.cloudflare.com https://clerk.accounts.dev;
  connect-src 'self' https://resolved-halibut-83.clerk.accounts.dev;
  img-src 'self' https://img.clerk.com;
  worker-src 'self' blob:;
  style-src 'self' 'unsafe-inline';
  frame-src 'self' https://challenges.cloudflare.com;
  form-action 'self';
`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
