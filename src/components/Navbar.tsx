"use client";

import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { LogIn, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 font-semibold">
          <span className="flex h-10 w-12 items-center justify-center rounded-md bg-white/80 p-1.5 shadow-sm ring-1 ring-border dark:bg-white/10">
            <Image src="/mic-logo.png" alt="Microsoft Innovations Club logo" width={44} height={32} priority />
          </span>
          <span className="hidden sm:inline">Microsoft Innovations Club</span>
          <span className="sm:hidden">MIC</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/#schedule" className={cn("hidden rounded-md px-3 py-2 text-sm font-medium hover:bg-accent sm:inline-flex")}>
            Schedule
          </Link>
          <Link href="/#sponsors" className={cn("hidden rounded-md px-3 py-2 text-sm font-medium hover:bg-accent sm:inline-flex")}>
            Sponsors
          </Link>
          <Link href="/#organizers" className={cn("hidden rounded-md px-3 py-2 text-sm font-medium hover:bg-accent sm:inline-flex")}>
            Organizers
          </Link>
          {status === "authenticated" ? (
            <Link href="/dashboard" className="hidden rounded-md px-3 py-2 text-sm font-medium hover:bg-accent sm:inline-flex">
              Dashboard
            </Link>
          ) : null}
          {session?.user.role === "admin" ? (
            <Link href="/admin" className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent sm:inline-flex">
              <ShieldCheck className="h-4 w-4" />
              Admin
            </Link>
          ) : null}
          {status === "authenticated" ? (
            <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          ) : (
            <Button onClick={() => signIn("google", { callbackUrl: "/#schedule" })}>
              <LogIn className="h-4 w-4" />
              Sign in
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
