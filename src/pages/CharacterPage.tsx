import React, { useState, useMemo, useEffect } from 'react';
import { gql, useQuery } from 'urql';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
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
      type
      gender
      origin {
        name
        type
      }
      location {
        name
        type
      }
      image
      episode {
        id
        name
        air_date
        episode
      }
      created
    }
  }
`;

interface GetCharacterData {
  character?: (Pick<Character, 'id' | 'name' | 'status' | 'species' | 'type' | 'gender' | 'image' | 'created'> & {
    origin?: { name?: string | null; type?: string | null } | null;
    location?: { name?: string | null; type?: string | null } | null;
    episode: Array<Pick<Episode, 'id' | 'name' | 'air_date' | 'episode'> | null>;
  }) | null;
}

interface GetCharacterVars {
  id: string;
}

const EPISODES_PER_PAGE = 5;

const CharacterPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [showLoader, setShowLoader] = useState(true);
  
  // *burp* Hey M-Morty, remember that twerking loader we made?
  // Well, turns out people LOVE it! The multiverse critics are calling it
  // "The most innovative use of Morty's dignity in a loading screen"
  useEffect(() => {
    setShowLoader(true);
    const minLoadingTime = 2000; // The perfect amount of time for maximum embarrassment
    
    const dimensionalPortal = setTimeout(() => {
      setShowLoader(false);
    }, minLoadingTime);

    return () => clearTimeout(dimensionalPortal);
  }, [id]); // Reset when character ID changes
  
  const [{ data, fetching, error }] = useQuery<GetCharacterData, GetCharacterVars>({
    query: CHARACTER_QUERY,
    variables: { id: id! },
  });

  // Sort episodes by air date and season/episode number
  const sortedEpisodes = useMemo(() => {
    if (!data?.character?.episode) return [];
    
    return [...data.character.episode]
      .filter((ep): ep is NonNullable<typeof ep> => ep !== null)
      .sort((a, b) => {
        // First try to sort by air date
        const dateA = a.air_date ? new Date(a.air_date).getTime() : 0;
        const dateB = b.air_date ? new Date(b.air_date).getTime() : 0;
        if (dateA !== dateB) return dateA - dateB;

        // If air dates are equal or invalid, sort by episode code
        const epNumA = parseInt(a.episode?.replace(/\D/g, '') || '0');
        const epNumB = parseInt(b.episode?.replace(/\D/g, '') || '0');
        return epNumA - epNumB;
      });
  }, [data?.character?.episode]);

  const totalPages = Math.ceil((sortedEpisodes?.length || 0) / EPISODES_PER_PAGE);
  const startIndex = (currentPage - 1) * EPISODES_PER_PAGE;
  const currentEpisodes = sortedEpisodes.slice(startIndex, startIndex + EPISODES_PER_PAGE);

  const handleGoBack = () => {
    const searchParams = new URLSearchParams(location.state?.from?.search || '');
    const params = {
      page: searchParams.get('page'),
      search: searchParams.get('search'),
      status: searchParams.get('status')
    };

    // Build the query string with all existing parameters
    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value!)}`)
      .join('&');

    navigate(queryString ? `/?${queryString}` : '/');
  };

  if (showLoader || fetching) return (
    <div className="character-page character-page--loading">
      <Loader />
    </div>
  );

  if (error) {
    return (
      <div className="character-page">
        <div className="error-message">
          <h2>Oops! Something went wrong</h2>
          <p>{error.message}</p>
          <div className="error-message__actions">
            <Button 
              onClick={() => window.location.reload()} 
              variant="primary"
            >
              Try Again
            </Button>
            <Button 
              onClick={handleGoBack}
              variant="secondary"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const character = data?.character;
  if (!character) {
    return (
      <div className="character-page">
        <div className="error-message">
          <h2>Character Not Found</h2>
          <p>The character you're looking for might have been removed or never existed.</p>
          <Button 
            onClick={handleGoBack}
            variant="primary"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string | null | undefined = 'unknown') => {
    switch (status?.toLowerCase()) {
      case 'alive': return '💚';
      case 'dead': return '💀';
      default: return '❓';
    }
  };

  return (
    <div className="character-page">
      <Button 
        onClick={handleGoBack}
        variant="text"
        className="character-page__back"
      >
        ← Back to Characters
      </Button>

      <div className="character-page__content">
        <div className="character-page__header">
          <div className="character-page__image-container">
            <img 
              src={character.image || ''} 
              alt={character.name || 'Character'} 
              className="character-page__image"
            />
            <div className="character-page__status-badge">
              {getStatusIcon(character.status)}
            </div>
          </div>
          
          <div className="character-page__info">
            <h1 className="character-page__name">
              {character.name || 'Unknown'}
            </h1>
            <div className="character-page__details">
              <div className="character-page__detail">
                <span className="character-page__label">Status:</span>
                <span className={`character-page__value character-page__value--${character.status?.toLowerCase() || 'unknown'}`}>
                  {character.status || 'Unknown'}
                </span>
              </div>
              <div className="character-page__detail">
                <span className="character-page__label">Species:</span>
                <span className="character-page__value">
                  {character.species || 'Unknown'}
                  {character.type && ` (${character.type})`}
                </span>
              </div>
              <div className="character-page__detail">
                <span className="character-page__label">Gender:</span>
                <span className="character-page__value">{character.gender || 'Unknown'}</span>
              </div>
              <div className="character-page__detail">
                <span className="character-page__label">Origin:</span>
                <span className="character-page__value">
                  {character.origin?.name || 'Unknown'}
                  {character.origin?.type && ` (${character.origin.type})`}
                </span>
              </div>
              <div className="character-page__detail">
                <span className="character-page__label">Location:</span>
                <span className="character-page__value">
                  {character.location?.name || 'Unknown'}
                  {character.location?.type && ` (${character.location.type})`}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="character-page__episodes">
          <div className="character-page__episodes-header">
            <h2 className="character-page__subtitle">
              Episodes ({sortedEpisodes.length})
            </h2>
            <p className="character-page__episodes-info">
              Showing {startIndex + 1}-{Math.min(startIndex + EPISODES_PER_PAGE, sortedEpisodes.length)} of {sortedEpisodes.length}
            </p>
          </div>

          <div className="episodes-list">
            {currentEpisodes.map((episode, index) => (
              <div 
                key={episode.id} 
                className="episode-card"
                style={{ 
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="episode-card__content">
                  <h3 className="episode-card__title">
                    {episode.name || 'Unknown Episode'}
                  </h3>
                  <div className="episode-card__meta">
                    <span className="episode-card__episode">{episode.episode}</span>
                    <span className="episode-card__date">
                      Aired: {episode.air_date || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="character-page__pagination">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterPage;
