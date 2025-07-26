import { useTheme } from '../context/ThemeContext.jsx';
import { DEFAULT_MARGIN } from '../config.js';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { darkMode, toggle } = useTheme();
  const [isClient, setIsClient] = useState(false);

  // 标记客户端已渲染
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <button onClick={toggle} style={{ marginLeft: DEFAULT_MARGIN }}>
      {isClient ? (darkMode ? 'Light Mode' : 'Dark Mode') : 'Loading.......'}
    </button>
  );
}
