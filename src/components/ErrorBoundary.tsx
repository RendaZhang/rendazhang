import * as Sentry from '@sentry/react';
import { LocalizedSection } from './ui';
import type { PropsWithChildren, ReactElement } from 'react';

export default function ErrorBoundary({ children }: PropsWithChildren): ReactElement {
  return (
    <Sentry.ErrorBoundary
      fallback={
        <LocalizedSection zhContent={<p>页面崩溃了</p>} enContent={<p>The page has crashed</p>} />
      }
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}
