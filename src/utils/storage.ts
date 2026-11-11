/**
 * Safe localStorage wrapper with try/catch and in-memory fallback.
 * Never throws or crashes even in private browsing, quota overflow, or SSR/Node test environments.
 */

const memoryFallback = new Map<string, string>();

export function safeGetItem<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        return JSON.parse(raw) as T;
      }
    } else if (memoryFallback.has(key)) {
      const raw = memoryFallback.get(key);
      if (raw !== undefined) {
        return JSON.parse(raw) as T;
      }
    }
  } catch {
    if (memoryFallback.has(key)) {
      try {
        return JSON.parse(memoryFallback.get(key)!) as T;
      } catch {
        return defaultValue;
      }
    }
  }
  return defaultValue;
}

export function safeSetItem<T>(key: string, value: T): boolean {
  const serialized = JSON.stringify(value);
  memoryFallback.set(key, serialized);
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, serialized);
      return true;
    }
  } catch {
    // Fallback to memoryFallback already succeeded above
    return false;
  }
  return true;
}

export function safeRemoveItem(key: string): void {
  memoryFallback.delete(key);
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // Ignore storage removal errors
  }
}
