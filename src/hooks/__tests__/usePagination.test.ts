import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../usePagination';

interface TestItem {
  id: number;
  name: string;
}

describe('usePagination', () => {
  const mockItems: TestItem[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
  }));

  it('initializes with default values', () => {
    const { result } = renderHook(() => usePagination<TestItem>());

    expect(result.current.currentPage).toBe(1);
    expect(result.current.currentItems).toHaveLength(0);
    expect(result.current.totalPages).toBe(0);
  });

  it('handles custom initial page and items per page', () => {
    const { result } = renderHook(() =>
      usePagination<TestItem>({ initialPage: 2, itemsPerPage: 10 })
    );

    expect(result.current.currentPage).toBe(2);
  });

  it('paginates items correctly', () => {
    const { result } = renderHook(() =>
      usePagination<TestItem>({ itemsPerPage: 10 })
    );

    act(() => {
      result.current.paginateItems(mockItems);
    });

    expect(result.current.totalPages).toBe(5);
    expect(result.current.currentItems).toHaveLength(10);
    expect(result.current.currentItems[0].name).toBe('Item 1');
  });

  it('changes page correctly', () => {
    const { result } = renderHook(() =>
      usePagination<TestItem>({ itemsPerPage: 10 })
    );

    act(() => {
      result.current.paginateItems(mockItems);
    });

    act(() => {
      result.current.setCurrentPage(2);
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.currentItems[0].name).toBe('Item 11');
  });

  it('handles empty items array', () => {
    const { result } = renderHook(() => usePagination<TestItem>());

    act(() => {
      result.current.paginateItems([]);
    });

    expect(result.current.totalPages).toBe(0);
    expect(result.current.currentItems).toHaveLength(0);
  });

  it('handles last page with fewer items', () => {
    const { result } = renderHook(() =>
      usePagination<TestItem>({ itemsPerPage: 30 })
    );

    act(() => {
      result.current.paginateItems(mockItems);
    });

    act(() => {
      result.current.setCurrentPage(2);
    });

    expect(result.current.currentItems).toHaveLength(20);
  });
}); 