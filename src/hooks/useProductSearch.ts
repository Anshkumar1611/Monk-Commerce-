import { useState, useEffect, useCallback, useRef } from 'react';
import { searchProducts } from '../services/api';
import type { Product } from '../types';

interface UseProductSearchReturn {
  products: Product[];
  loading: boolean;
  hasMore: boolean;
  listRef: React.RefObject<HTMLDivElement | null>;
  handleScroll: () => void;
  reset: () => void;
}

/**
 * Hook for searching products with pagination and infinite scroll
 * @param isActive - Whether the search should be active (e.g., modal is open)
 * @param searchTerm - The search term
 * @param limit - Number of products per page (default: 10)
 * @returns Products, loading state, scroll handler, and ref
 */
export function useProductSearch(
  isActive: boolean,
  searchTerm: string,
  limit: number = 10
): UseProductSearchReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Fetch products
  const fetchProducts = useCallback(async (search: string, pageNum: number, append: boolean = false) => {
    setLoading(true);
    try {
      const data = await searchProducts(search, pageNum, limit);
      if (append) {
        setProducts(prev => [...prev, ...data]);
      } else {
        setProducts(data || []);
      }
      setHasMore(data && data.length === limit);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts(append ? products : []);
    } finally {
      setLoading(false);
    }
  }, [limit, products]);

  // Search effect
  useEffect(() => {
    if (!isActive) return;
    
    setPage(1);
    fetchProducts(searchTerm, 1, false);
  }, [searchTerm, isActive]); // eslint-disable-line react-hooks/exhaustive-deps

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (!listRef.current || loading || !hasMore) return;
    
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(searchTerm, nextPage, true);
    }
  }, [loading, hasMore, page, searchTerm, fetchProducts]);

  // Reset function
  const reset = useCallback(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, []);

  return {
    products,
    loading,
    hasMore,
    listRef,
    handleScroll,
    reset,
  };
}

