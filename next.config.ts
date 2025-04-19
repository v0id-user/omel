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
    // TODO: just for testing, remove in production we need to cache the webpack
    config.cache = false;
    return config;
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
