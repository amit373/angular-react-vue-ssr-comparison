'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="mb-4 text-6xl font-bold">500</h1>
      <h2 className="mb-4 text-2xl font-semibold">Something went wrong</h2>
      <p className="mb-8 text-muted-foreground">
        An error occurred while processing your request.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="rounded-md bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-md border bg-card px-6 py-3 hover:bg-accent"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

