import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppProviders } from "@/providers/AppProviders";

import "./globals.scss";

export const metadata: Metadata = {
  title: "Final Auth",
  description: "Next.js SSR and CSR authentication example",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
