import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <nav className="navbar">
      {/* Your existing navbar content */}
      <button 
        className="toggle-button"
        onClick={toggleDarkMode}
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? '🌙' : '☀️'}
      </button>
    </nav>
  );
}

export default Navbar; 