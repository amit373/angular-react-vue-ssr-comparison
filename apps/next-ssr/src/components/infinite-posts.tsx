'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Post } from '@ssr-comparison/types';
import { observeIntersection, truncateText } from '@ssr-comparison/utils';
import { skeletonClass } from '@ssr-comparison/ui/recipes';

type PostsPageResponse = {
  data: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  nextCursor: string | null;
};

export function InfinitePosts({ initial }: { initial: PostsPageResponse }) {
  const [items, setItems] = useState<Post[]>(() => initial.data);
  const [nextCursor, setNextCursor] = useState<string | null>(() => initial.nextCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEnd = useMemo(() => nextCursor === null, [nextCursor]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return observeIntersection(
      sentinelRef.current,
      () => {
        if (isLoading || isEnd) return;
        void loadMore();
      },
      { rootMargin: '600px 0px' }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isEnd, nextCursor]);

  const loadMore = async () => {
    if (!nextCursor) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/posts?cursor=${encodeURIComponent(nextCursor)}`, {
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) throw new Error(res.statusText);

      const json = (await res.json()) as PostsPageResponse;
      setItems((prev) => [...prev, ...json.data]);
      setNextCursor(json.nextCursor);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load more');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="group rounded-lg border bg-card p-6 transition-shadow hover:shadow-lg"
          >
            <h2 className="mb-2 text-xl font-semibold group-hover:text-primary">
              {post.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {truncateText(post.body, 150)}
            </p>
            <div className="mt-4 text-xs text-muted-foreground">
              Post #{post.id} • User {post.userId}
            </div>
          </Link>
        ))}

        {isLoading
          ? new Array(8).fill(0).map((_, i) => (
              <div
                key={`sk-${i}`}
                className="rounded-lg border bg-card p-6 animate-pulse"
              >
                <div className={skeletonClass('h-5 w-3/4')} />
                <div className="mt-4 space-y-2">
                  <div className={skeletonClass('h-3 w-full')} />
                  <div className={skeletonClass('h-3 w-5/6')} />
                  <div className={skeletonClass('h-3 w-2/3')} />
                </div>
              </div>
            ))
          : null}
      </div>

      {error ? (
        <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {isEnd ? (
        <div className="mt-8 text-center text-sm text-muted-foreground">
          You’ve reached the end.
        </div>
      ) : (
        <div ref={sentinelRef} className="h-1" />
      )}
    </div>
  );
}
