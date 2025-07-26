import { useTheme } from '../context/ThemeContext.jsx';
import { DEFAULT_MARGIN } from '../config.js';

export default function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <span>
      <button
        onClick={() => setTheme(true)}
        title="切换到黑色主题"
        style={{ marginLeft: DEFAULT_MARGIN }}
      >
        黑色主题
      </button>
      <button
        onClick={() => setTheme(false)}
        title="切换到白色主题"
        style={{ marginLeft: DEFAULT_MARGIN }}
      >
        白色主题
      </button>
    </span>
  );
}
