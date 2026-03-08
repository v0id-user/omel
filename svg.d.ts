declare module '*.svg' {
  import * as React from 'react';
  const component: React.FC<React.SVGProps<SVGSVGElement>>;
  export default component;
}

declare module '*.svg?url' {
  const content: string;
  export default content;
}
