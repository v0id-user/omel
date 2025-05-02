import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';
import createMDX from '@next/mdx';
import remarkFrontmatter from 'remark-frontmatter';
import remarkFlexibleToc from 'remark-flexible-toc';
import remarkGfm from 'remark-gfm';
import rehypeMdxImportMedia from 'rehype-mdx-import-media';
import rehypeSlug from 'rehype-slug';

const nextConfig: NextConfig = {
  experimental: {
    nodeMiddleware: true,
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  webpack: config => {
    // TODO: Change on production
    config.cache = false;
    return config;
  },

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
      remarkFrontmatter,
      remarkGfm,
      remarkFlexibleToc,
      () => (tree, file) => ({
        ...tree,
        children: [
          {
            type: 'mdxJsxFlowElement',
            name: 'BodyWrapper',
            attributes: [
              {
                type: 'mdxJsxAttribute',
                name: 'toc',
                value: JSON.stringify(file.data.toc),
              },
            ],
            children: tree.children,
          },
          {
            type: 'mdxJsxFlowElement',
            name: 'TOCGenerator',
            attributes: [
              {
                type: 'mdxJsxAttribute',
                name: 'items',
                value: JSON.stringify(file.data.toc),
              },
            ],
            children: [],
          },
        ],
      }),
    ],
    rehypePlugins: [rehypeMdxImportMedia, rehypeSlug],
  },
});

export default withSentryConfig(withMDX(nextConfig), {
  org: 'omel-y2',
  project: 'javascript-nextjs',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
