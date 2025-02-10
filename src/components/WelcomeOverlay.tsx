import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import portalVideo from '../assets/videos/portal.webm';
import RiPLogo from '../assets/images/rickipedia-logo.svg';

interface WelcomeOverlayProps {
  onComplete: () => void;
}

const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ onComplete }) => {
  const [showLogo, setShowLogo] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Start the sequence after portal animation
    const logoTimer = setTimeout(() => setShowLogo(true), 2000);
    const messageTimer = setTimeout(() => setShowMessage(true), 3000);
    const buttonTimer = setTimeout(() => setShowButton(true), 4000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(messageTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  return (
    <div className="welcome-overlay">
      <div className="welcome-overlay__portal-container">
        <video 
          className="welcome-overlay__portal"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={portalVideo} type="video/webm" />
        </video>

        <img 
          src={RiPLogo}
          alt="RickiPedia Logo"
          className={classNames('welcome-overlay__logo', {
            'welcome-overlay__logo--visible': showLogo
          })}
        />
      </div>

      <div className={classNames('welcome-overlay__message', {
        'welcome-overlay__message--visible': showMessage
      })}>
        <p>*burp* Listen here, you little piece of sh*t...</p>
        <p>You're about to enter a dimension where light mode comes with a special surprise!</p>
        <p>Let's just say the sun is feeling extra... musical today. *burp*</p>
        <p>Consider yourself warned, you interdimensional traveler!</p>
      </div>

      <button 
        className={classNames('welcome-overlay__button', {
          'welcome-overlay__button--visible': showButton
        })}
        onClick={onComplete}
      >
        Enter the Dimension
      </button>
    </div>
  );
};

export default WelcomeOverlay;
