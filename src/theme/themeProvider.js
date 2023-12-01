// ThemeProvider.js
import React, { createContext, useState, useContext } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [activeMode, setActiveMode] = useState('light'); // Default to light mode

  // Function to toggle the mode
  const toggleMode = () => {
    setActiveMode(activeMode === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ activeMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
