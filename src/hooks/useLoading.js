import { useState, useCallback } from 'react';

/**
 * Custom React hook to manage loading state for async operations.
 *
 * @param {boolean} [initialLoading=false] - Optional initial loading state.
 * @returns {{
 *   loading: boolean,
 *   withLoading: <T>(fn: (...args: any[]) => Promise<T>, onError?: (e: any) => void) => (...args: any[]) => Promise<T>
 * }}
 *
 * Usage:
 *   const { loading, withLoading } = useLoading();
 *   const fetchWithLoading = withLoading(fetchData, handleError);
 *   useEffect(() => { fetchWithLoading(); }, []);
 *   // in JSX: {loading && <LoadingSpinner />}
 */
export function useLoading(initialLoading = false) {
  const [loading, setLoading] = useState(initialLoading);

  /**
   * Wraps an async function to automatically manage loading state and handle errors.
   * @param {Function} asyncFn - The async function to wrap.
   * @param {Function} [onError] - Optional error handler.
   * @returns {Function} - A function that manages loading and error state.
   */
  const withLoading = useCallback(
    (asyncFn, onError) =>
      async (...args) => {
        setLoading(true);
        try {
          return await asyncFn(...args);
        } catch (e) {
          if (onError) onError(e);
          else throw e;
        } finally {
          setLoading(false);
        }
      },
    []
  );

  return { loading, withLoading };
}
