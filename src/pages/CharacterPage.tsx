import React, { useState } from 'react';
import { gql, useQuery } from 'urql';
import { useParams, Link } from 'react-router-dom';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import Button from '../components/Button';
import { Character, Episode } from '../generated/graphql';

export const CHARACTER_QUERY = gql`
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
      image
      episode {
        id
        name
        air_date
      }
    }
  }
`;

interface GetCharacterData {
  character?: (Pick<Character, 'id' | 'name' | 'status' | 'species' | 'gender' | 'image'> & {
    origin?: { name?: string | null } | null;
    episode: Array<Pick<Episode, 'id' | 'name' | 'air_date'> | null>;
  }) | null;
}

interface GetCharacterVars {
  id: string;
}

const EPISODES_PER_PAGE = 5;

const CharacterPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  
  const [{ data, fetching, error }] = useQuery<GetCharacterData, GetCharacterVars>({
    query: CHARACTER_QUERY,
    variables: { id: id! },
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

  const character = data?.character;
  if (!character) {
    return (
      <div className="error-message">
        <p>Character not found</p>
        <Link to="/" className="button button--primary">
          Back to Home
        </Link>
      </div>
    );
  }

  const episodes = character.episode.filter((ep): ep is NonNullable<typeof ep> => ep !== null);
  const totalPages = Math.ceil(episodes.length / EPISODES_PER_PAGE);
  const startIndex = (currentPage - 1) * EPISODES_PER_PAGE;
  const currentEpisodes = episodes.slice(startIndex, startIndex + EPISODES_PER_PAGE);

  return (
    <div className="character-page">
      <Link to="/" className="character-page__back">
        ← Back to Characters
      </Link>

      <div className="character-page__content">
        <div className="character-page__header">
          <img 
            src={character.image || ''} 
            alt={character.name || 'Character'} 
            className="character-page__image"
          />
          
          <div className="character-page__info">
            <h1 className="character-page__name">{character.name || 'Unknown'}</h1>
            <div className="character-page__details">
              <div className="character-page__detail">
                <span className="character-page__label">Status:</span>
                <span className={`character-page__value character-page__value--${character.status?.toLowerCase() || 'unknown'}`}>
                  {character.status || 'Unknown'}
                </span>
              </div>
              <div className="character-page__detail">
                <span className="character-page__label">Species:</span>
                <span className="character-page__value">{character.species || 'Unknown'}</span>
              </div>
              <div className="character-page__detail">
                <span className="character-page__label">Gender:</span>
                <span className="character-page__value">{character.gender || 'Unknown'}</span>
              </div>
              <div className="character-page__detail">
                <span className="character-page__label">Origin:</span>
                <span className="character-page__value">{character.origin?.name || 'Unknown'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="character-page__episodes">
          <h2 className="character-page__subtitle">Episodes</h2>
          <div className="episodes-list">
            {currentEpisodes.map((episode) => (
              <div key={episode.id} className="episode-card">
                <h3 className="episode-card__title">{episode.name || 'Unknown Episode'}</h3>
                <p className="episode-card__date">Air Date: {episode.air_date || 'Unknown'}</p>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterPage;
