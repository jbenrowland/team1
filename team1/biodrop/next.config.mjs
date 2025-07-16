import { withSentryConfig } from "@sentry/nextjs";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import createMDX from "@next/mdx";
import withPWA from "next-pwa";
import runtimeCaching from "next-pwa/cache.js";

// Flag to conditionally disable static builds and Sentry
const isDockerBuild = process.env.SKIP_STATIC_BUILD === 'true';
const isSentryDisabled = process.env.SENTRY_SKIP_DOWNLOAD === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',

  exportPathMap: async function () {
    if (isDockerBuild) {
      return {
        '/': { page: '/' },
        '/en/500': { page: '/en/500' },
      };
    }
    return null;
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrettyCode, { theme: "dracula", defaultLang: "plaintext" }]],
    providerImportSource: "@mdx-js/react",
  },
});

const nextDataIndex = runtimeCaching.findIndex(
  (entry) => entry.options.cacheName === "next-data"
);

if (nextDataIndex !== -1) {
  runtimeCaching[nextDataIndex].handler = "NetworkFirst";
} else {
  throw new Error("Failed to find next-data object in runtime caching");
}

const pwaConfig = {
  disable: false,
  dest: "public",
  runtimeCaching,
  register: true,
  skipWaiting: true,
};

const sentryConfigPlugins = {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
};

const sentryConfig = {
  widenClientFileUpload: true,
  transpileClientSDK: true,
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: false,
};

// Chain the PWA and MDX plugins first
const withPlugins = withMDX(withPWA(pwaConfig)(nextConfig));

// Conditionally apply Sentry last
const finalConfig = isSentryDisabled
  ? withPlugins
  : withSentryConfig(withPlugins, sentryConfigPlugins, sentryConfig);

export default finalConfig;
