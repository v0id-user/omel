import createMDX from '@next/mdx';
import remarkFrontmatter from 'remark-frontmatter';
import remarkFlexibleToc from 'remark-flexible-toc';
import remarkGfm from 'remark-gfm';
import rehypeMdxImportMedia from 'rehype-mdx-import-media';
import rehypeSlug from 'rehype-slug';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

/*
 * I stole most of this from https://github.com/polarsource/polar/blob/main/clients/apps/web/next.config.mjs
 * yeah.. idk why nextjs support mdx, but you need million plugins to make it useful, thanks to polar for
 * the config lol...
 */
const withMDX = createMDX({
  extensions: ['.mdx', '.md'],
  options: {
    remarkPlugins: [
      remarkFrontmatter,
      remarkGfm,
      remarkFlexibleToc,
      () => (tree, file) => ({
        ...tree,
        children: [
          // Wrap the main content of the MDX file in a BodyWrapper (div) component
          // so we might position the TOC on the right side of the content
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
          // Automatically add a TOCGenerator component to the end of the MDX file
          // using the TOC data from the remarkFlexibleToc plugin
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

export default withMDX(nextConfig);
