import { lazy, type ComponentType } from 'react';

/**
 * Enhanced React.lazy with automatic chunk load failure recovery.
 * Catches dynamic import failures (caused by new deployments, stale chunk hashes, or network hiccups)
 * and performs a controlled single page reload to fetch the latest index.html and assets.
 * Uses sessionStorage to prevent infinite reload loops.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T } | { [key: string]: any }>,
  chunkKey: string = 'app_chunk'
) {
  return lazy(async () => {
    const storageKey = `teamsync_chunk_reload_${chunkKey}`;

    try {
      const module = await factory();
      // On success, clear any stored retry state
      try {
        sessionStorage.removeItem(storageKey);
      } catch {
        // Ignore session storage access restrictions
      }

      // If module has default, return as { default: T }
      if ('default' in module && module.default) {
        return { default: module.default as T };
      }

      // If named export matches or fallback to first function
      const firstExport = Object.values(module).find((v) => typeof v === 'function');
      if (firstExport) {
        return { default: firstExport as T };
      }

      return module as { default: T };
    } catch (error: any) {
      const errorMessage = error?.message?.toLowerCase() || '';
      const isChunkError =
        errorMessage.includes('dynamically imported module') ||
        errorMessage.includes('loading chunk') ||
        errorMessage.includes('failed to fetch') ||
        errorMessage.includes('module script failed') ||
        errorMessage.includes('error loading');

      const hasReloaded = typeof window !== 'undefined' && sessionStorage.getItem(storageKey);

      if (isChunkError && !hasReloaded && typeof window !== 'undefined') {
        console.warn(`[TeamSync] Chunk load failed for ${chunkKey}. Performing one-time reload for fresh deployment assets...`, error);
        sessionStorage.setItem(storageKey, 'true');
        window.location.reload();
        // Return a pending promise while page reloads
        return new Promise<{ default: T }>(() => {});
      }

      console.error(`[TeamSync] Dynamic import permanent failure for ${chunkKey}:`, error);
      throw error;
    }
  });
}
