'use client';

import React, { useCallback, useEffect, useState } from 'react';

/**
 * Storage utility functions with SSR safety and automatic parsing
 */
export const storage = {
  /**
   * Get a value from localStorage with automatic parsing
   * @param key - The localStorage key
   * @param defaultValue - Default value if key doesn't exist
   * @returns The parsed value or default value
   */
  get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }

      // Try to parse JSON, fallback to string if parsing fails
      try {
        const parsed = JSON.parse(item);
        return parsed as T;
      } catch {
        // If parsing fails, return the raw string value (for non-JSON values)
        return item as unknown as T;
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  /**
   * Set a value in localStorage with automatic stringification
   * @param key - The localStorage key
   * @param value - The value to store
   */
  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      // Stringify if it's an object/array, otherwise store as string
      if (typeof value === 'object' && value !== null) {
        window.localStorage.setItem(key, JSON.stringify(value));
      } else {
        window.localStorage.setItem(key, String(value));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  },

  /**
   * Remove a value from localStorage
   * @param key - The localStorage key
   */
  remove(key: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  /**
   * Check if localStorage is available
   * @returns true if localStorage is available
   */
  isAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  },
};

/**
 * Custom hook for localStorage with SSR safety and automatic parsing
 * @param key - The localStorage key
 * @param initialValue - The initial value if key doesn't exist
 * @returns [value, setValue, isReady] - The stored value, setter function, and ready state
 */
export function useStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isReady, setIsReady] = useState(false);

  // Initialize from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsReady(true);
      return;
    }
    
    const value = storage.get(key, initialValue);
    setStoredValue(value);
    setIsReady(true);
  }, [key, initialValue]);

  // Setter function that handles both direct values and updater functions
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to localStorage using storage.set
      storage.set(key, valueToStore);
    },
    [key, storedValue]
  );

  return [storedValue, setValue, isReady];
}
