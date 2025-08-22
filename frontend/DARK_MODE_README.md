# Dark Mode Feature

This document describes the dark mode toggle feature implemented in the Store Management application.

## Features

- **Automatic Theme Detection**: The app automatically detects the user's system preference for dark/light mode
- **Persistent Settings**: User's theme preference is saved in localStorage and persists across sessions
- **Smooth Transitions**: All theme changes include smooth CSS transitions
- **Material-UI Integration**: Full integration with Material-UI theming system
- **Custom CSS Variables**: Consistent theming using CSS custom properties

## Implementation Details

### 1. Theme Context (`contexts/ThemeContext.js`)
- Manages dark mode state across the application
- Handles localStorage persistence
- Provides `darkMode` state and `toggleDarkMode` function
- Automatically applies CSS classes to document body

### 2. Dynamic Material-UI Theme (`App.js`)
- Creates dynamic themes based on dark mode state
- Customizes palette, components, and styling
- Integrates with Material-UI's ThemeProvider

### 3. CSS Variables (`index.css`)
- Defines color schemes for both light and dark modes
- Uses CSS custom properties for consistent theming
- Includes smooth transitions for theme changes

### 4. Dark Mode Toggle Component (`Components/DarkModeToggle.jsx`)
- Reusable toggle button component
- Includes tooltip with descriptive text
- Can be used anywhere in the application

### 5. Navbar Integration (`Components/Navbar/Navbar.jsx`)
- Dark mode toggle button in the navigation bar
- Positioned next to user profile menu
- Styled to match the navbar design

## Usage

### Using the Dark Mode Toggle
```jsx
import { useTheme } from '../contexts/ThemeContext';

const MyComponent = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  
  return (
    <button onClick={toggleDarkMode}>
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
};
```

### Using the DarkModeToggle Component
```jsx
import DarkModeToggle from '../Components/DarkModeToggle';

const MyComponent = () => {
  return <DarkModeToggle size="small" />;
};
```

### Accessing Theme State
```jsx
import { useTheme } from '../contexts/ThemeContext';

const MyComponent = () => {
  const { darkMode } = useTheme();
  
  return (
    <div className={darkMode ? 'dark-theme' : 'light-theme'}>
      Content
    </div>
  );
};
```

## CSS Variables

The application uses CSS custom properties for consistent theming:

### Light Mode Variables
- `--bg-primary`: #ffffff
- `--bg-secondary`: #f5f5f5
- `--text-primary`: #333333
- `--text-secondary`: #666666
- `--accent-color`: #1976d2

### Dark Mode Variables
- `--bg-primary`: #121212
- `--bg-secondary`: #1e1e1e
- `--text-primary`: #ffffff
- `--text-secondary`: #b0b0b0
- `--accent-color`: #90caf9

## Browser Support

- Modern browsers with CSS custom properties support
- Automatic fallback to light mode for unsupported browsers
- LocalStorage for persistence (graceful degradation if not available)

## Future Enhancements

- System theme change detection (listening to `prefers-color-scheme` changes)
- Custom theme colors
- Theme-specific component styling
- Animation preferences based on user's motion preferences
