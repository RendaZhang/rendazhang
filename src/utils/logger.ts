import { isProduction } from './env';

type LogMethod = (...args: unknown[]) => void;

interface Logger {
  log: LogMethod;
  info: LogMethod;
  debug: LogMethod;
  warn: LogMethod;
  error: LogMethod;
}

const logger: Logger = {
  log: (...args) => {
    if (!isProduction()) {
      console.log(...args);
    }
  },
  info: (...args) => {
    if (!isProduction()) {
      console.info(...args);
    }
  },
  debug: (...args) => {
    if (!isProduction()) {
      console.debug(...args);
    }
  },
  warn: (...args) => {
    console.warn(...args);
  },
  error: (...args) => {
    console.error(...args);
  }
};

export default logger;
export type { Logger };
