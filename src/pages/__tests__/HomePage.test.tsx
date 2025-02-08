import React from 'react';
import { render, screen, waitFor } from '../../test-utils/test-utils';
import { graphql, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import HomePage from '../HomePage';

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
        },
        {
          id: '2',
          name: 'Morty Smith',
          status: 'Alive',
          species: 'Human',
          image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
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
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('HomePage', () => {
  it('renders loading state initially', () => {
    render(<HomePage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders characters after loading', async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    });
  });

  it('renders character cards with correct links', async () => {
    render(<HomePage />);

    await waitFor(() => {
      const links = screen.getAllByRole('link');
      expect(links[0]).toHaveAttribute('href', '/character/1');
      expect(links[1]).toHaveAttribute('href', '/character/2');
    });
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
      expect(screen.getByText(/error/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
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

    await waitFor(() => {
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
  });
}); 