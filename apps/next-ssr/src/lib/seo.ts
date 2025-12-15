import { headers } from 'next/headers';

export const getRequestOrigin = async (): Promise<string> => {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const proto = h.get('x-forwarded-proto') ?? 'http';

  if (!host) return `${proto}://example.com`;
  return `${proto}://${host}`;
};
