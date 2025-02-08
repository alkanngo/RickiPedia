import React, { useState } from 'react';
import { gql, useQuery } from 'urql';
import CharacterCard from '../components/CharacterCard';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import Button from '../components/Button';
import { Character } from '../generated/graphql';

export const CHARACTERS_QUERY = gql`
  query GetCharacters($page: Int!) {
    characters(page: $page) {
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
      }
    }
  }
`;

interface GetCharactersData {
  characters?: {
    info?: {
      count?: number | null;
      pages?: number | null;
      next?: number | null;
      prev?: number | null;
    } | null;
    results?: Array<Pick<Character, 'id' | 'name' | 'status' | 'species' | 'image'> | null> | null;
  } | null;
}

interface GetCharactersVars {
  page: number;
}

const HomePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [{ data, fetching, error }] = useQuery<GetCharactersData, GetCharactersVars>({
    query: CHARACTERS_QUERY,
    variables: { page: currentPage },
  });

  if (fetching) return <Loader />;

  if (error) {
    return (
      <div className="error-message">
        <p>Error: {error.message}</p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="primary"
        >
          Retry
        </Button>
      </div>
    );
  }

  const characters = data?.characters?.results?.filter((char): char is NonNullable<typeof char> => char !== null) || [];
  const totalPages = data?.characters?.info?.pages || 0;

  return (
    <div className="home-page">
      <h1 className="home-page__title">Rick and Morty Characters</h1>
      
      <div className="home-page__grid">
        {characters.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>

      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default HomePage;
