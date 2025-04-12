import { type ReactNode } from "react";
import { AppLayout } from "~/components/layout/AppLayout";

interface PageLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function PageLayout({
  title,
  description,
  children,
  className = "space-y-6",
}: PageLayoutProps) {
  return (
    <AppLayout>
      <div className={className}>
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && <p className="text-gray-500">{description}</p>}
        {children}
      </div>
    </AppLayout>
  );
}
