import { LocalizedSection } from '../ui';

interface LoadingTexts {
  coreLoadFailed: string;
  loading: string;
}

interface LoadingIndicatorProps {
  isError: boolean;
  textsZh: LoadingTexts;
  textsEn: LoadingTexts;
}

export default function LoadingIndicator({ isError, textsZh, textsEn }: LoadingIndicatorProps) {
  return (
    <div id="c-loading-indicator" className="c-loading-indicator" role="status" aria-live="polite">
      {isError ? (
        <p className="c-loading-indicator-text">
          <LocalizedSection zhContent={textsZh.coreLoadFailed} enContent={textsEn.coreLoadFailed} />
        </p>
      ) : (
        <>
          <div className="c-chat-widget-skeleton" aria-hidden="true"></div>
          <p className="c-loading-indicator-text">
            <LocalizedSection zhContent={textsZh.loading} enContent={textsEn.loading} />
          </p>
        </>
      )}
    </div>
  );
}
