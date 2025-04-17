import BodyWrapper from '@/components/mdx/BodyWrapper';
import ProseWrapper from '@/components/mdx/ProseWrapper';
import TOCGenerator from '@/components/mdx/TOCGenerator';
import { TableOfContents } from '@/components/mdx/TableOfContents';
import TableOfContentsScrollSpy from '@/components/mdx/TableOfContentsScrollSpy';

// This file exports all MDX components and registers them for use in MDX files
// These components will be automatically available in all MDX files

export { BodyWrapper, ProseWrapper, TOCGenerator, TableOfContents, TableOfContentsScrollSpy };

// This is the MDX components object that Next.js will use to render MDX content
const mdxComponents = {
  BodyWrapper,
  ProseWrapper,
  TOCGenerator,
  TableOfContents,
  TableOfContentsScrollSpy,
};

export default mdxComponents;
