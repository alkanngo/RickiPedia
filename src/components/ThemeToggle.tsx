import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useTheme } from '../context/ThemeContext';
import darkModeMoon from '../assets/images/dark-mode-moon.png';
import lightModeSun from '../assets/images/light-mode-sun.gif';
import screamingSound from '../assets/audio/A-beautiful-sunny-day.mp3';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio(screamingSound);
      audioRef.current.loop = true;
    }

    // Play or pause based on theme
    if (!isDark) {
      const playPromise = audioRef.current.play();
      // Handle the promise to avoid uncaught promise errors
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Playback prevented. Require user interaction first:", error);
        });
      }
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [isDark]);

  const handleToggle = () => {
    toggleTheme();
  };

  return (
    <button
      className={classNames('theme-toggle', {
        'theme-toggle--dark': isDark,
        'theme-toggle--light': !isDark
      })}
      onClick={handleToggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <img 
        src={isDark ? darkModeMoon : lightModeSun}
        alt={isDark ? "Dark mode moon" : "Light mode screaming sun"}
        className={classNames('theme-toggle__icon', {
          'theme-toggle__icon--dark': isDark,
          'theme-toggle__icon--light': !isDark
        })}
      />
    </button>
  );
};

export default ThemeToggle; 