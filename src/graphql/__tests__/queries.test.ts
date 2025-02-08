import { print } from 'graphql';
import { CHARACTERS_QUERY } from '../../pages/HomePage';
import { CHARACTER_QUERY } from '../../pages/CharacterPage';

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
      expect(printedQuery).toContain('query GetCharacters($page: Int!)');
      expect(printedQuery).toContain('characters(page: $page)');
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