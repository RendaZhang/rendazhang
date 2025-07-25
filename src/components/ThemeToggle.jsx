import { useTheme } from '../context/ThemeContext.jsx';
import { DEFAULT_MARGIN } from '../config.js';

export default function ThemeToggle() {
  const { darkMode, toggle } = useTheme();
  return (
    <button onClick={toggle} style={{ marginLeft: DEFAULT_MARGIN }}>
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
