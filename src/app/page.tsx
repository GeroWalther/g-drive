import {
  UserButton,
  SignedIn,
  SignUpButton,
  SignInButton,
  SignedOut,
} from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {
  // redirect("/drive");
  // Log the current user ID for database updates
  const { userId } = await auth();
  console.log("Current user ID for database:", userId);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-black p-4 text-white">
      <div className="mb-8 flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-12 w-12 text-blue-400"
        >
          <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
          <path d="M9 17h6" />
          <path d="M9 13h6" />
        </svg>
        <h1 className="text-4xl font-bold">G-Drive</h1>
      </div>

      <div className="mb-12 max-w-2xl text-center">
        <h2 className="mb-4 text-3xl font-semibold">
          Your files, accessible anywhere
        </h2>
        <p className="text-xl text-blue-200">
          Store, share, and collaborate on files and folders from any mobile
          device, tablet, or computer
        </p>
      </div>

      <div className="flex flex-col items-center gap-6">
        <SignedOut>
          <div className="flex flex-col gap-4 sm:flex-row">
            <SignInButton>
              <button className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="rounded-lg border border-blue-400 bg-transparent px-6 py-3 font-medium text-white transition-colors hover:bg-blue-900/30">
                Create Account
              </button>
            </SignUpButton>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="flex flex-col items-center gap-4">
            <p className="text-xl">Welcome back!</p>
            <Link
              href="/drive"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Go to My Drive
            </Link>
            <div className="mt-2">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
