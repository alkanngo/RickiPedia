import React, { useState } from 'react';
import classNames from 'classnames';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  onFilterChange: (status: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="search-bar">
      <div className="search-bar__input-wrapper">
        <input
          type="text"
          className={classNames('search-bar__input', {
            'search-bar__input--has-value': searchTerm.length > 0
          })}
          placeholder="Search characters..."
          value={searchTerm}
          onChange={handleSearchChange}
          aria-label="Search characters"
        />
        <span className="search-bar__icon">🔍</span>
      </div>
      
      <div className="search-bar__filters">
        <select
          className="search-bar__select"
          onChange={(e) => onFilterChange(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="">All Status</option>
          <option value="Alive">Alive</option>
          <option value="Dead">Dead</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar; 