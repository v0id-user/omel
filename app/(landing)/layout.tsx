'use client';

import { ReactLenis } from 'lenis/react';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        prevent: node => node.classList.contains('ReactVirtualized__Grid'),
      }}
    >
      {children}
    </ReactLenis>
  );
}
