import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';
import createMDX from '@next/mdx';
import { fileURLToPath } from 'node:url';

const remarkWrapBodyWithToc = fileURLToPath(
  new URL('./lib/mdx/remark-wrap-body-with-toc.mjs', import.meta.url)
);

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        // TODO: Change on production
        // Grab the existing rule that handles SVG imports
        // Reapply the existing rule, but only for svg imports ending in ?url
        // Convert all other *.svg imports to React components
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  headers: async () => {
    const cachingDays = 3;
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: `public, max-age=${cachingDays * 24 * 60 * 60}, immutable`,
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [
      'remark-frontmatter',
      'remark-gfm',
      'remark-flexible-toc',
      remarkWrapBodyWithToc,
    ],
    rehypePlugins: ['rehype-mdx-import-media', 'rehype-slug'],
  },
});

export default withSentryConfig(withMDX(nextConfig), {
  org: 'omel-y2',
  project: 'javascript-nextjs',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
    automaticVercelMonitors: true,
  },
});
