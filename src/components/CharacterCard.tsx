import React from 'react';
import { Link } from 'react-router-dom';
import { Character } from '../generated/graphql';

interface CharacterCardProps {
  character: Pick<Character, 'id' | 'name' | 'image' | 'species' | 'status'>;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  // Provide fallbacks for nullable fields
  const name = character.name || 'Unknown';
  const image = character.image || 'https://via.placeholder.com/300';
  const status = character.status?.toLowerCase() || 'unknown';

  return (
    <Link to={`/character/${character.id}`} className="character-card">
      <div className="character-card__image-container">
        <img 
          src={image}
          alt={name}
          className="character-card__image"
          loading="lazy"
        />
        <div className={`character-card__status character-card__status--${status}`}>
          {character.status || 'Unknown'}
        </div>
      </div>
      <div className="character-card__info">
        <h2 className="character-card__name">{name}</h2>
        <p className="character-card__species">{character.species || 'Unknown species'}</p>
      </div>
    </Link>
  );
};

export default CharacterCard; 