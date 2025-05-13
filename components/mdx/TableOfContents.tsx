import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { TocItem } from 'remark-flexible-toc';
import { twMerge } from 'tailwind-merge';
import TableOfContentsScrollSpy from '@/components/mdx/TableOfContentsScrollSpy';

export const TableOfContents = ({ items }: { items: TocItem[] | undefined }) => {
  if (!items || items.length === 0) return null;

  return (
    <div
      id="toc"
      className="text-right w-full flex flex-shrink-0 flex-col md:sticky md:top-24 md:max-h-[calc(100vh-6rem)] md:overflow-y-auto md:w-64 lg:left-8"
      dir="rtl"
    >
      <nav className="w-full mt-16 flex-col gap-y-4 md:flex">
        <h3 className="text-black dark:text-white text-right text-lg font-medium">
          محتويات الصفحة
        </h3>
        <ul className="flex flex-col gap-y-2.5 border-l border-gray-200 pl-4 text-sm">
          {items.map(item => (
            <li key={item.href} className="text-right">
              <Link
                id={`toc-entry-${item.href}`}
                href={item.href}
                className={twMerge(
                  'flex flex-row-reverse gap-x-2 leading-normal text-gray-500 transition-colors duration-200 ease-in-out hover:text-gray-700',
                  'aria-selected:text-gray-700 aria-selected:dark:text-white aria-selected:font-medium',
                  'scroll-mt-24'
                )}
              >
                {item.depth > 2 && <ArrowRight className="mt-[4px] rotate-180" />}
                {item.value}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <TableOfContentsScrollSpy />
    </div>
  );
};
