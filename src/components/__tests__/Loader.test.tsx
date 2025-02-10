import React from 'react';
import { render, screen } from '../../test-utils/test-utils';
import Loader from '../Loader';

describe('Loader', () => {
  it('renders with correct accessibility attributes', () => {
    render(<Loader />);
    
    const loader = screen.getByRole('status');
    expect(loader).toBeInTheDocument();
    expect(screen.getByText('Loading... Aw geez!')).toHaveClass('sr-only');
  });

  it('has the correct class names', () => {
    render(<Loader />);
    
    expect(screen.getByRole('status')).toHaveClass('loader');
    expect(screen.getByTestId('loader-video')).toHaveClass('loader__video');
  });

  it('is visible to the user', () => {
    render(<Loader />);
    
    const loader = screen.getByRole('status');
    expect(loader).toBeInTheDocument();
    expect(loader).toBeVisible();
  });
}); 