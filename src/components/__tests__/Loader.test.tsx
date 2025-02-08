import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from '../Loader';

describe('Loader', () => {
  it('renders with correct accessibility attributes', () => {
    render(<Loader />);
    
    const loader = screen.getByRole('status');
    expect(loader).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toHaveClass('sr-only');
  });

  it('has the correct class names', () => {
    render(<Loader />);
    
    expect(screen.getByRole('status')).toHaveClass('loader');
    expect(screen.getByRole('status').firstChild).toHaveClass('loader__spinner');
  });

  it('is visible to the user', () => {
    render(<Loader />);
    
    const loader = screen.getByRole('status');
    const styles = window.getComputedStyle(loader);
    expect(styles.display).not.toBe('none');
    expect(styles.visibility).not.toBe('hidden');
  });
}); 