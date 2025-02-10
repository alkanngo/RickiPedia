import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import classNames from 'classnames';
import { useTheme } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import CharacterPage from './pages/CharacterPage';
import WelcomeOverlay from './components/WelcomeOverlay';

const App: React.FC = () => {
  const { theme } = useTheme();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Check if user has seen the welcome overlay
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (hasSeenWelcome) {
      setShowWelcome(false);
    }
  }, []);

  const handleWelcomeComplete = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setShowWelcome(false);
  };

  useEffect(() => {
    document.documentElement.className = classNames({
      'dark-theme': theme === 'dark',
      'light-theme': theme === 'light'
    });
  }, [theme]);

  return (
    <ErrorBoundary>
      <Router>
        {showWelcome && <WelcomeOverlay onComplete={handleWelcomeComplete} />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/character/:id" element={<CharacterPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App; 