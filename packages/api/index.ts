import type {
  Post,
  Comment,
  Album,
  Photo,
  Todo,
  User,
} from '@ssr-comparison/types';
import { API_BASE_URL, APIError, MAX_RETRIES } from '@ssr-comparison/utils';

// Cache for server-side requests
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function fetchWithRetry<T>(
  url: string,
  retries = MAX_RETRIES
): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new APIError(
        `API Error: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }

    return await response.json();
  } catch (error) {
    if (retries > 0 && error instanceof Error) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetchWithRetry<T>(url, retries - 1);
    }
    throw error;
  }
}

async function fetchCached<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  const data = await fetcher();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}

// Posts API
export async function getPosts(): Promise<Post[]> {
  return fetchCached('posts', () =>
    fetchWithRetry<Post[]>(`${API_BASE_URL}/posts`)
  );
}

export async function getPost(id: number): Promise<Post> {
  return fetchCached(`post:${id}`, () =>
    fetchWithRetry<Post>(`${API_BASE_URL}/posts/${id}`)
  );
}

// Comments API
export async function getComments(): Promise<Comment[]> {
  return fetchCached('comments', () =>
    fetchWithRetry<Comment[]>(`${API_BASE_URL}/comments`)
  );
}

export async function getCommentsByPostId(postId: number): Promise<Comment[]> {
  return fetchCached(`comments:post:${postId}`, () =>
    fetchWithRetry<Comment[]>(`${API_BASE_URL}/posts/${postId}/comments`)
  );
}

// Users API
export async function getUsers(): Promise<User[]> {
  return fetchCached('users', () =>
    fetchWithRetry<User[]>(`${API_BASE_URL}/users`)
  );
}

export async function getUser(id: number): Promise<User> {
  return fetchCached(`user:${id}`, () =>
    fetchWithRetry<User>(`${API_BASE_URL}/users/${id}`)
  );
}

// Albums API
export async function getAlbums(): Promise<Album[]> {
  return fetchCached('albums', () =>
    fetchWithRetry<Album[]>(`${API_BASE_URL}/albums`)
  );
}

export async function getAlbum(id: number): Promise<Album> {
  return fetchCached(`album:${id}`, () =>
    fetchWithRetry<Album>(`${API_BASE_URL}/albums/${id}`)
  );
}

export async function getAlbumsByUserId(userId: number): Promise<Album[]> {
  return fetchCached(`albums:user:${userId}`, () =>
    fetchWithRetry<Album[]>(`${API_BASE_URL}/users/${userId}/albums`)
  );
}

// Photos API
export async function getPhotos(): Promise<Photo[]> {
  return fetchCached('photos', () =>
    fetchWithRetry<Photo[]>(`${API_BASE_URL}/photos`)
  );
}

export async function getPhotosByAlbumId(albumId: number): Promise<Photo[]> {
  return fetchCached(`photos:album:${albumId}`, () =>
    fetchWithRetry<Photo[]>(`${API_BASE_URL}/albums/${albumId}/photos`)
  );
}

// Todos API
export async function getTodos(): Promise<Todo[]> {
  return fetchCached('todos', () =>
    fetchWithRetry<Todo[]>(`${API_BASE_URL}/todos`)
  );
}

export async function getTodosByUserId(userId: number): Promise<Todo[]> {
  return fetchCached(`todos:user:${userId}`, () =>
    fetchWithRetry<Todo[]>(`${API_BASE_URL}/users/${userId}/todos`)
  );
}

