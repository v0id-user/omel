import * as React from 'react';
import { render } from '@react-email/render';

/**
 * Renders a React email component to HTML string using methods compatible with Next.js
 */
export async function renderReactEmail(component: React.ReactElement): Promise<string> {
  try {
    // Use @react-email/render which is compatible with Next.js App Router
    return await render(component);
  } catch (error: any) {
    console.error('Failed to render email template:', error);
    throw new Error(`Email rendering failed: ${error.message || String(error)}`);
  }
}
