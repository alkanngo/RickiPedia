import React, { useState, useEffect } from 'react';
import { useQuery } from 'urql';
import { useSearchParams } from 'react-router-dom';
import classNames from 'classnames';
import CharacterCard from '../components/CharacterCard';
import Loader from '../components/Loader';
import ThemeToggle from '../components/ThemeToggle';
import RiPLogo from '../assets/images/rickipedia-logo.svg';

interface Character {
  id: string;
  name: string;
  status: string;
  species: string;
  image: string;
}

interface CharactersResponse {
  characters: {
    info: {
      count: number;
      pages: number;
      next: number | null;
      prev: number | null;
    };
    results: Character[];
  };
}

const CHARACTERS_QUERY = `
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
      }
    }
  }
`;

const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get('page') || '1');
  const initialSearch = searchParams.get('search') || '';
  const initialStatus = searchParams.get('status') || '';
  
  const [showLoader, setShowLoader] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    setShowLoader(true);
    // *burp* Listen here Morty, we're gonna delay this loader for like 2 seconds
    // Why? *burp* Because sometimes you gotta stop and appreciate the little things, Morty
    // Like watching yourself twerk in an infinite loop while data loads in parallel dimensions
    // I mean, that's just good UX design, Morty! That's what the people want!
    // Plus, *burp* I may or may not have bet 50 Schmeckles that users would watch this for at least 2 seconds

    const minLoadingTime = 2000; // Time it takes for Morty to question his life choices
    
    const dimensionalPortal = setTimeout(() => {
      setShowLoader(false);
    }, minLoadingTime);

    return () => clearTimeout(dimensionalPortal);
  }, [currentPage, searchTerm, statusFilter]);

  useEffect(() => {
    setSearchParams(prev => {
      if (currentPage === 1) {
        prev.delete('page');
      } else {
        prev.set('page', currentPage.toString());
      }
      
      if (searchTerm) {
        prev.set('search', searchTerm);
      } else {
        prev.delete('search');
      }
      
      if (statusFilter) {
        prev.set('status', statusFilter);
      } else {
        prev.delete('status');
      }
      
      return prev;
    });
  }, [currentPage, searchTerm, statusFilter, setSearchParams]);

  useEffect(() => {
    if (!isInitialLoad) {
      setCurrentPage(1);
    } else {
      setIsInitialLoad(false);
    }
  }, [searchTerm, statusFilter]);

  const [{ data, fetching, error }] = useQuery<CharactersResponse>({
    query: CHARACTERS_QUERY,
    variables: {
      page: currentPage,
      filter: {
        name: searchTerm,
        status: statusFilter || undefined,
      },
    },
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && (!data?.characters.info.pages || newPage <= data.characters.info.pages)) {
      setCurrentPage(newPage);
    }
  };

  const handleReset = () => {
    setCurrentPage(1);
    setSearchTerm('');
    setStatusFilter('');
    setSearchParams({});
  };

  if (error) return (
    <div className="error-container">
      <div data-testid="error-message" className="error-message">
        Error loading characters: {error.message}
      </div>
      <button 
        data-testid="retry-button"
        className="retry-button"
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="home-page">
      <header className="home-page__header">
        <img 
          src={RiPLogo} 
          alt="RickiPedia Logo" 
          className={classNames('home-page__logo', {
            'home-page__logo--clickable': true
          })}
          onClick={handleReset}
          style={{ cursor: 'pointer' }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleReset();
            }
          }}
        />
        <ThemeToggle />
      </header>

      <div className="home-page__search-section">
        <input
          type="text"
          className={classNames('search-bar__input', {
            'search-bar__input--has-value': searchTerm.length > 0
          })}
          placeholder="Search characters..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <select
          className={classNames('status-filter', {
            'status-filter--has-value': statusFilter !== ''
          })}
          value={statusFilter}
          onChange={handleStatusChange}
        >
          <option value="">All Status</option>
          <option value="Alive">Alive</option>
          <option value="Dead">Dead</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>

      <div className="home-page__main-container">
        <button
          className={classNames('home-page__navigation-button', {
            'home-page__navigation-button--disabled': currentPage === 1
          })}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          ←
        </button>

        <main className="home-page__content">
          {(showLoader || fetching) ? (
            <Loader />
          ) : data?.characters.results.length === 0 ? (
            <div className="no-results">
              <h2>No characters found</h2>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="home-page__grid-container">
                {data?.characters.results.map((character: Character) => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                  />
                ))}
              </div>

              <div className={classNames('home-page__mobile-navigation', {
                'home-page__mobile-navigation--single-page': data?.characters.info.pages === 1
              })}>
                <button
                  className={classNames('home-page__mobile-button', {
                    'home-page__mobile-button--disabled': currentPage === 1
                  })}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button
                  className={classNames('home-page__mobile-button', {
                    'home-page__mobile-button--disabled': currentPage === data?.characters.info.pages
                  })}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === data?.characters.info.pages}
                >
                  Next
                </button>
              </div>

              <div className="home-page__page-info">
                Page {currentPage} of {data?.characters.info.pages}
              </div>
            </>
          )}
        </main>

        <button
          className={classNames('home-page__navigation-button', {
            'home-page__navigation-button--disabled': currentPage === data?.characters.info.pages
          })}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === data?.characters.info.pages}
          aria-label="Next page"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default HomePage;
