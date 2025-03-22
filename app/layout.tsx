import type { Metadata } from "next";
import "./globals.css";
import { PostHogProvider } from "./providers";

export const metadata: Metadata = {
  title: "Omel CRM",
  description: "خذ تجربة خدمة العملاء المثالية مع أوميل.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
