import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

const DarkModeToggle = ({ size = 'medium', sx = {} }) => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
      <IconButton
        onClick={toggleDarkMode}
        size={size}
        sx={{
          color: 'inherit',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          },
          ...sx
        }}
      >
        {darkMode ? <LightMode /> : <DarkMode />}
      </IconButton>
    </Tooltip>
  );
};

export default DarkModeToggle;
