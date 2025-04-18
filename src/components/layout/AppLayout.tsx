import { type ReactNode } from "react";
import { Navbar } from "./Navbar";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen flex-col">
      <SignedIn>
        <Navbar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </div>
  );
}
