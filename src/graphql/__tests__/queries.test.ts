import { print } from 'graphql';
import { gql } from '@urql/core';

const CHARACTERS_QUERY = gql`
  query GetCharacters($page: Int!, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        status
        species
        image
        location {
          name
        }
      }
    }
  }
`;

const CHARACTER_QUERY = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      id
      name
      status
      species
      gender
      origin {
        name
      }
      location {
        name
      }
      image
      episode {
        id
        name
        air_date
        episode
      }
    }
  }
`;

describe('GraphQL Queries', () => {
  describe('CHARACTERS_QUERY', () => {
    it('includes all necessary fields', () => {
      const printedQuery = print(CHARACTERS_QUERY);
      
      expect(printedQuery).toContain('id');
      expect(printedQuery).toContain('name');
      expect(printedQuery).toContain('status');
      expect(printedQuery).toContain('species');
      expect(printedQuery).toContain('image');
      expect(printedQuery).toContain('info');
      expect(printedQuery).toContain('pages');
      expect(printedQuery).toContain('next');
      expect(printedQuery).toContain('prev');
    });

    it('accepts page variable', () => {
      const printedQuery = print(CHARACTERS_QUERY);
      expect(printedQuery).toContain('query GetCharacters($page: Int!, $filter: FilterCharacter)');
      expect(printedQuery).toContain('characters(page: $page, filter: $filter)');
    });
  });

  describe('CHARACTER_QUERY', () => {
    it('includes all necessary fields', () => {
      const printedQuery = print(CHARACTER_QUERY);
      
      expect(printedQuery).toContain('id');
      expect(printedQuery).toContain('name');
      expect(printedQuery).toContain('status');
      expect(printedQuery).toContain('species');
      expect(printedQuery).toContain('gender');
      expect(printedQuery).toContain('origin');
      expect(printedQuery).toContain('image');
      expect(printedQuery).toContain('episode');
      expect(printedQuery).toContain('air_date');
    });

    it('accepts id variable', () => {
      const printedQuery = print(CHARACTER_QUERY);
      expect(printedQuery).toContain('query GetCharacter($id: ID!)');
      expect(printedQuery).toContain('character(id: $id)');
    });
  });
}); 