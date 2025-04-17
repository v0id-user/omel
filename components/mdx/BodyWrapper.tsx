import { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';
import ProseWrapper from '@/components/MDX/ProseWrapper';
import { TableOfContents } from '@/components/MDX/TableOfContents';
import type { TocItem } from 'remark-flexible-toc';

interface BodyWrapperProps extends PropsWithChildren {
  toc?: TocItem[];
  className?: string;
}

const BodyWrapper = ({ children, toc, className }: BodyWrapperProps) => {
  return (
    <div className={twMerge('flex flex-row-reverse gap-x-8', className)}>
      <div className="flex-1">
        <ProseWrapper>{children}</ProseWrapper>
      </div>
      {toc && toc.length > 0 && (
        <div className="hidden lg:block">
          <TableOfContents items={toc} />
        </div>
      )}
    </div>
  );
};

export default BodyWrapper;
