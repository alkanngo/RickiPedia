import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="loader" role="status">
      <div className="loader__spinner"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loader; 