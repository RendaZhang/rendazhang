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
    <div id="c-loading-indicator" className="c-loading-indicator">
      {isError ? (
        <p>
          <LocalizedSection zhContent={textsZh.coreLoadFailed} enContent={textsEn.coreLoadFailed} />
        </p>
      ) : (
        <>
          <div className="c-spinner c-chat-spinner"></div>
          <p>
            <LocalizedSection zhContent={textsZh.loading} enContent={textsEn.loading} />
          </p>
        </>
      )}
    </div>
  );
}
