import React from 'react';
import { render, screen } from '../../test-utils/test-utils';
import CharacterCard from '../CharacterCard';

const mockCharacter = {
  id: '1',
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
};

describe('CharacterCard', () => {
  it('renders character information correctly', () => {
    render(<CharacterCard character={mockCharacter} />);
    
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Human')).toBeInTheDocument();
    expect(screen.getByText('Alive')).toBeInTheDocument();
    
    const image = screen.getByAltText('Rick Sanchez') as HTMLImageElement;
    expect(image.src).toBe(mockCharacter.image);
  });

  it('handles missing data gracefully', () => {
    const incompleteCharacter = {
      id: '2',
      name: null,
      status: null,
      species: null,
      image: null,
    };

    render(<CharacterCard character={incompleteCharacter} />);
    
    // Check for name in the heading
    expect(screen.getByRole('heading', { name: 'Unknown' })).toBeInTheDocument();
    expect(screen.getByText('Unknown species')).toBeInTheDocument();
    // Check for status text
    expect(screen.getByText('Unknown', { selector: '.character-card__status' })).toBeInTheDocument();
    
    const image = screen.getByAltText('Unknown') as HTMLImageElement;
    expect(image.src).toContain('placeholder.com');
  });

  it('applies correct status styling', () => {
    render(<CharacterCard character={mockCharacter} />);
    
    const statusElement = screen.getByText('Alive');
    expect(statusElement).toHaveClass('character-card__status');
    expect(statusElement).toHaveClass('character-card__status--alive');
  });

  it('links to the correct character page', () => {
    render(<CharacterCard character={mockCharacter} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/character/1');
  });
}); 