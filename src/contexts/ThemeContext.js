import React, { createContext, useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export const ThemeContext = createContext(null);

const defaultTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#24292e',
      light: '#373e47',
      dark: '#1c2125',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#007bff',
      light: '#2196f3',
      dark: '#0056b3',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
      disabled: '#9e9e9e',
      hint: '#666666',
      icon: '#666666',
    },
    divider: '#e0e0e0',
    action: {
      active: '#666666',
      hover: '#9e9e9e',
      selected: '#90a4ae',
      disabled: '#bdbdbd',
      disabledBackground: '#f5f5f5',
    },
  },
});

export const ThemeProviderWrapper = ({ children }) => {
  const [mode, setMode] = useState(() => {
    // Check localStorage first
    const savedMode = localStorage.getItem('theme-mode');
    if (savedMode) return savedMode;
    
    // If not in localStorage, check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e) => {
      if (!localStorage.getItem('theme-mode')) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addListener(listener);
    return () => mediaQuery.removeListener(listener);
  }, []);

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('theme-mode', newMode);
  };

  const theme = createTheme({
    ...defaultTheme,
    palette: {
      mode: mode,
      ...(mode === 'dark' ? {
        primary: {
          main: '#e5e5e5',
          light: '#d4d4d4',
          dark: '#c4c4c4',
          contrastText: '#1a1a1a',
        },
        secondary: {
          main: '#64b5f6',
          light: '#90caf9',
          dark: '#42a5f5',
          contrastText: '#1a1a1a',
        },
        background: {
          default: '#1a1a1a',
          paper: '#2d2d2d',
        },
        text: {
          primary: '#ffffff',
          secondary: '#d4d4d4',
          disabled: '#8a8a8a',
          hint: '#b3b3b3',
          icon: '#d4d4d4',
        },
        divider: '#424242',
        action: {
          active: '#b3b3b3',
          hover: '#9e9e9e',
          selected: '#757575',
          disabled: '#616161',
          disabledBackground: '#303030',
        },
      } : {
        primary: {
          main: '#24292e',
          light: '#373e47',
          dark: '#1c2125',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#007bff',
          light: '#2196f3',
          dark: '#0056b3',
          contrastText: '#ffffff',
        },
        background: {
          default: '#ffffff',
          paper: '#f5f5f5',
        },
        text: {
          primary: '#000000',
          secondary: '#666666',
          disabled: '#9e9e9e',
        },
        divider: '#e0e0e0',
        action: {
          active: '#666666',
          hover: '#9e9e9e',
          selected: '#90a4ae',
          disabled: '#bdbdbd',
          disabledBackground: '#f5f5f5',
        },
      }),
    },
  });

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
