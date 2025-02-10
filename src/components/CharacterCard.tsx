import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { Character } from '../generated/graphql';

interface CharacterCardProps {
  character: Pick<Character, 'id' | 'name' | 'image' | 'species' | 'status'>;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  const location = useLocation();
  // Provide fallbacks for nullable fields
  const name = character.name || 'Unknown';
  const image = character.image || 'https://via.placeholder.com/300';
  const status = character.status?.toLowerCase() || 'unknown';
  const species = character.species || 'Unknown species';

  return (
    <Link 
      to={`/character/${character.id}`}
      className="character-card"
      state={{ from: location }}
      data-testid="character-link"
    >
      <div className="character-card__image-container" data-testid="character-card">
        <img 
          src={image}
          alt={name}
          className="character-card__image"
          loading="lazy"
        />
        <div className="character-card__title">
          <h2>{name}</h2>
        </div>
        <div className="character-card__overlay">
          <div className="character-card__info">
            <h2 className="character-card__name">{name}</h2>
            <div 
              className={classNames('character-card__status', {
                [`character-card__status--${status}`]: status
              })}
              data-testid="character-status"
            >
              {character.status}
            </div>
            <p className="character-card__species">{species}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CharacterCard; 