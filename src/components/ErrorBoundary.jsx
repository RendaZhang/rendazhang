import * as Sentry from '@sentry/react';
import { LocalizedSection } from './ui';

const ErrorBoundary = ({ children }) => (
  <Sentry.ErrorBoundary
    fallback={
      <LocalizedSection zhContent={<p>页面崩溃了</p>} enContent={<p>The page has crashed</p>} />
    }
  >
    {children}
  </Sentry.ErrorBoundary>
);

export default ErrorBoundary;
