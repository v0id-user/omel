import * as React from 'react';
import { renderToString } from 'react-dom/server';

/**
 * Renders a React email component to HTML string using methods compatible with Bun
 */
export function renderReactEmail(component: React.ReactElement): string {
  try {
    // Use renderToString which is more widely supported
    return renderToString(component);
    // @ts-ignore
  } catch (error: any) {
    console.error('Failed to render email template:', error);
    throw new Error(`Email rendering failed: ${error.message || String(error)}`);
  }
}
