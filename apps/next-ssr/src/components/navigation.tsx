'use client';

import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

export function Navigation() {
  return (
    <nav
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-primary"
            aria-label="Home"
          >
            SSR Comparison
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/posts"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Posts
            </Link>
            <Link
              href="/users"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Users
            </Link>
            <Link
              href="/albums"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Albums
            </Link>
            <Link
              href="/photos"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Photos
            </Link>
            <Link
              href="/todos"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Todos
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              About
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

