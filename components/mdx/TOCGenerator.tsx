import { TableOfContents } from '@/components/mdx/TableOfContents';
import type { TocItem } from 'remark-flexible-toc';

interface TOCGeneratorProps {
  items: TocItem[];
}

const TOCGenerator = ({ items }: TOCGeneratorProps) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="hidden lg:block">
      <TableOfContents items={items} />
    </div>
  );
};

export default TOCGenerator;
