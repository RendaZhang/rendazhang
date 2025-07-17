import { useTheme } from '../context/ThemeContext.jsx';

export default function ThemeToggle() {
  const { darkMode, toggle } = useTheme();
  return (
    <button onClick={toggle} style={{ marginLeft: '1rem' }}>
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
