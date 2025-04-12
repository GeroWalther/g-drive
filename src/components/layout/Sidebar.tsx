import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
  ClockIcon,
  HomeIcon,
  PlusIcon,
  SharedIcon,
  StarIcon,
  StorageIcon,
  TrashIcon,
} from "~/components/ui/Icons";

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function NavLink({ href, icon, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100"
    >
      {icon}
      {children}
    </Link>
  );
}

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col border-r">
      <div className="p-4">
        <Button className="w-full justify-start gap-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800">
          <PlusIcon className="h-5 w-5" />
          New
        </Button>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        <NavLink
          href="/"
          icon={<HomeIcon className="mr-3 h-5 w-5 text-gray-500" />}
        >
          My Drive
        </NavLink>
        <NavLink
          href="/shared"
          icon={<SharedIcon className="mr-3 h-5 w-5 text-gray-500" />}
        >
          Shared with me
        </NavLink>
        <NavLink
          href="/recent"
          icon={<ClockIcon className="mr-3 h-5 w-5 text-gray-500" />}
        >
          Recent
        </NavLink>
        <NavLink
          href="/starred"
          icon={<StarIcon className="mr-3 h-5 w-5 text-gray-500" />}
        >
          Starred
        </NavLink>
        <NavLink
          href="/trash"
          icon={<TrashIcon className="mr-3 h-5 w-5 text-gray-500" />}
        >
          Trash
        </NavLink>
      </nav>
      <Separator />
      <div className="p-4 text-xs text-gray-500">
        <div className="mb-2 flex items-center gap-2">
          <StorageIcon className="h-4 w-4" />
          Storage
        </div>
        <div className="mb-1 h-2 rounded-full bg-gray-200">
          <div className="h-2 w-1/4 rounded-full bg-blue-600"></div>
        </div>
        <p>2.5 GB of 10 GB used</p>
      </div>
    </div>
  );
}
