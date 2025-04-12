import Link from "next/link";
import { ChevronRightIcon, HomeIcon } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav className={`flex items-center text-sm ${className}`}>
      <ol className="flex items-center space-x-1">
        <li>
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground flex items-center"
          >
            <HomeIcon className="mr-1 h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            <ChevronRightIcon className="text-muted-foreground h-4 w-4" />
            {index === items.length - 1 ? (
              <span className="text-foreground ml-1 font-medium">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-foreground ml-1"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
