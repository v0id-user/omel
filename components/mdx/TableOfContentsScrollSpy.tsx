'use client';

import { useEffect } from 'react';

const TableOfContentsScrollSpy = () => {
  useEffect(() => {
    const article = document.querySelector('article');
    if (!article) return;

    const headings = article.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const callback = (entries: IntersectionObserverEntry[]) => {
      const intersectingEntries = entries.filter(entry => entry.isIntersecting);
      if (intersectingEntries.length === 0) return;

      // Find the heading that is closest to the top of the viewport
      const activeHeading = intersectingEntries.reduce((closest, current) => {
        if (!closest) return current;
        return current.boundingClientRect.top < closest.boundingClientRect.top ? current : closest;
      });

      headings.forEach(heading => {
        const tocEntry = document.getElementById(`toc-entry-${heading.id}`);
        if (!tocEntry) return;
        if (heading === activeHeading.target) {
          tocEntry.setAttribute('aria-selected', 'true');
          // Scroll the TOC entry into view if it's not visible
          tocEntry.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          tocEntry.setAttribute('aria-selected', 'false');
        }
      });
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: '-20% 0px -80% 0px', // Adjust these values to control when a section is considered "active"
      threshold: [0, 1],
    });

    headings.forEach(heading => observer.observe(heading));

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
};

export default TableOfContentsScrollSpy;
