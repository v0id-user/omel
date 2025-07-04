import { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

const ProseWrapper = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
  return (
    <div
      className={twMerge(
        className,
        'prose dark:prose-invert max-w-3xl',
        'dark:text-gray-200 text-gray-600',
        'prose-img:rounded-2xl prose-img:shadow-sm prose-img:border prose-img:border-gray-200 dark:prose-img:border-gray-800',
        'prose-headings:text-black prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg prose-h6:text-md dark:prose-headings:text-white prose-headings:font-medium',
        'prose-a:text-blue-500 dark:prose-a:text-blue-400 prose-a:no-underline prose-a:font-normal',
        'dark:prose-pre:bg-gray-800 dark:prose-pre:border-gray-700 prose-pre:border prose-pre:border-transparent prose-pre:bg-gray-100 prose-pre:rounded-2xl prose-pre:text-gray-600 dark:prose-pre:text-gray-200',
        'prose-code:before:content-none prose-code:after:content-none prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:font-normal prose-code:rounded-sm prose-code:px-1.5 prose-code:py-1',
        // Arabic support
        'prose-p:text-right prose-p:leading-relaxed',
        'prose-headings:text-right',
        'prose-ul:text-right prose-ol:text-right',
        'prose-li:text-right',
        'prose-blockquote:text-right prose-blockquote:border-r prose-blockquote:border-l-0 prose-blockquote:pr-4 prose-blockquote:pl-0',
        'prose-figure:text-right',
        'prose-figcaption:text-right',
        'prose-table:text-right',
        'prose-th:text-right prose-td:text-right',
        'prose-hr:my-8'
      )}
      dir="rtl"
    >
      {children}
    </div>
  );
};

export default ProseWrapper;
