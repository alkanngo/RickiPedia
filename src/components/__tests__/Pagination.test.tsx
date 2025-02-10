import React from 'react';
import { render, screen, fireEvent } from '../../test-utils/test-utils';
import { vi } from 'vitest';
import Pagination from '../Pagination';

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    onPageChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders current page and total pages', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByRole('button', { name: '1' })).toHaveClass('pagination__page--active');
    expect(screen.getAllByRole('button')).toHaveLength(7); // 5 page buttons + prev + next
  });

  it('disables previous button on first page', () => {
    render(<Pagination {...defaultProps} />);
    const prevButton = screen.getByLabelText('Previous page');
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} />);
    const nextButton = screen.getByLabelText('Next page');
    expect(nextButton).toBeDisabled();
  });

  it('enables both buttons when on middle page', () => {
    render(<Pagination {...defaultProps} currentPage={3} />);
    const prevButton = screen.getByLabelText('Previous page');
    const nextButton = screen.getByLabelText('Next page');
    
    expect(prevButton).not.toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  it('calls onPageChange with correct page number when clicking next', () => {
    render(<Pagination {...defaultProps} />);
    const nextButton = screen.getByLabelText('Next page');
    
    fireEvent.click(nextButton);
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with correct page number when clicking previous', () => {
    render(<Pagination {...defaultProps} currentPage={2} />);
    const prevButton = screen.getByLabelText('Previous page');
    
    fireEvent.click(prevButton);
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(1);
  });

  it('handles single page case', () => {
    render(<Pagination {...defaultProps} totalPages={1} />);
    
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
    expect(screen.getByLabelText('Next page')).toBeDisabled();
    expect(screen.getAllByRole('button')).toHaveLength(3); // 1 page button + prev + next
  });

  it('handles zero pages case', () => {
    render(<Pagination {...defaultProps} totalPages={0} />);
    
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
    expect(screen.getByLabelText('Next page')).toBeDisabled();
    expect(screen.getAllByRole('button')).toHaveLength(2); // just prev + next buttons
  });
}); 