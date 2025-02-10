import React from 'react';
import { render, screen, waitFor } from '../../test-utils/test-utils';
import { graphql, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import HomePage from '../HomePage';
import { vi } from 'vitest';

const mockCharactersResponse = {
  data: {
    characters: {
      info: {
        count: 2,
        pages: 1,
        next: null,
        prev: null,
      },
      results: [
        {
          id: '1',
          name: 'Rick Sanchez',
          status: 'Alive',
          species: 'Human',
          image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
          location: {
            name: 'Earth'
          }
        },
        {
          id: '2',
          name: 'Morty Smith',
          status: 'Alive',
          species: 'Human',
          image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
          location: {
            name: 'Earth'
          }
        },
      ],
    },
  },
};

const server = setupServer(
  graphql.query('GetCharacters', () => {
    return HttpResponse.json(mockCharactersResponse);
  }),
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  vi.clearAllTimers();
});
afterAll(() => server.close());

describe('HomePage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders loading state initially', () => {
    render(<HomePage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders characters after loading', async () => {
    render(<HomePage />);

    // Fast-forward past the loading state
    await vi.advanceTimersByTimeAsync(2000);

    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });

    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
  });

  it('renders character cards with correct links', async () => {
    render(<HomePage />);

    // Fast-forward past the loading state
    await vi.advanceTimersByTimeAsync(2000);

    await waitFor(() => {
      expect(screen.getAllByTestId('character-link')).toHaveLength(2);
    });

    const links = screen.getAllByTestId('character-link');
    expect(links[0]).toHaveAttribute('href', '/character/1');
    expect(links[1]).toHaveAttribute('href', '/character/2');
  });

  it('handles error state', async () => {
    server.use(
      graphql.query('GetCharacters', () => {
        return HttpResponse.json({
          errors: [{ message: 'Failed to fetch' }]
        });
      }),
    );

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    expect(screen.getByTestId('retry-button')).toBeInTheDocument();
  });

  it('handles empty results', async () => {
    server.use(
      graphql.query('GetCharacters', () => {
        return HttpResponse.json({
          data: {
            characters: {
              info: { count: 0, pages: 0, next: null, prev: null },
              results: [],
            },
          },
        });
      }),
    );

    render(<HomePage />);

    // Fast-forward past the loading state
    await vi.advanceTimersByTimeAsync(2000);

    await waitFor(() => {
      expect(screen.getByText(/no characters found/i)).toBeInTheDocument();
    });
  });
}); 