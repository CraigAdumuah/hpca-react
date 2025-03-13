import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { isDarkMode, toggleDarkMode, fontSize, setFontSize, language, setLanguage } = useTheme();

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      
      <div className="settings-section">
        <h2>Theme</h2>
        <div className="setting-item">
          <label>Dark Mode</label>
          <button 
            className={`toggle-button ${isDarkMode ? 'active' : ''}`}
            onClick={toggleDarkMode}
          >
            {isDarkMode ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h2>Display</h2>
        <div className="setting-item">
          <label>Font Size</label>
          <select 
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h2>Language</h2>
        <div className="setting-item">
          <label>Select Language</label>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>
      </div>
    </div>
  );
} 