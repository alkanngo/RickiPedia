import { useState, useCallback } from 'react';

interface UsePaginationProps {
  initialPage?: number;
  itemsPerPage?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  currentItems: T[];
  totalPages: number;
  paginateItems: (items: T[]) => void;
}

export function usePagination<T>({
  initialPage = 1,
  itemsPerPage = 20,
}: UsePaginationProps = {}): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [items, setItems] = useState<T[]>([]);

  const paginateItems = useCallback((newItems: T[]) => {
    setItems(newItems);
  }, []);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  return {
    currentPage,
    setCurrentPage,
    currentItems,
    totalPages,
    paginateItems,
  };
} 