import type { ReactNode } from "react";

import { Header } from "@/components/Header/Header";

type ProtectedLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
