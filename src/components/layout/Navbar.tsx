"use client";

import Link from "next/link";
// import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { UserButton } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import type { FormEvent } from "react";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  // If we navigate away from search, clear the search query
  useEffect(() => {
    if (!pathname.startsWith("/search")) {
      setSearchQuery("");
    }
  }, [pathname]);

  // Handle search form submission
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-background sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b px-4 md:px-6">
      <div className="flex items-center gap-6">
        <Link
          href="/drive"
          className="mr-2 flex items-center gap-2 text-xl font-bold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9" />
            <path d="M13 2v7h7" />
          </svg>
          G-Drive
        </Link>
      </div>
      <form
        onSubmit={handleSearch}
        className="relative mx-auto max-w-md flex-1 md:block lg:max-w-lg"
      >
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground h-4 w-4"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <Input
          type="search"
          placeholder="Search in Drive"
          className="bg-secondary/50 w-full border-none pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
      {/* <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full md:hidden"
          onClick={() => router.push("/search")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span className="sr-only">Search</span>
        </Button> */}

      <div className="ml-2 flex items-center gap-4">
        <UserButton />
      </div>

      {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label="User menu"
            >
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      {/* </div> */}
    </header>
  );
}
