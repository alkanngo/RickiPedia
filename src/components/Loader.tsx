import React from 'react';
import mortyTwerk from '../assets/videos/morty-twerk.webm';

const Loader: React.FC = () => {
  return (
    <div className="loader" role="status">
      <video 
        className="loader__video"
        autoPlay
        loop
        muted
        playsInline
        data-testid="loader-video"
      >
        <source src={mortyTwerk} type="video/webm" />
      </video>
      <span className="sr-only">Loading... Aw geez!</span>
    </div>
  );
};

export default Loader; 