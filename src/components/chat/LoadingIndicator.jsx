import { LocalizedSection } from '../ui';

export default function LoadingIndicator({ isError, textsZh, textsEn }) {
  return (
    <div id="loading-indicator" className="loading-indicator">
      {isError ? (
        <p>
          <LocalizedSection zhContent={textsZh.coreLoadFailed} enContent={textsEn.coreLoadFailed} />
        </p>
      ) : (
        <>
          <div className="spinner"></div>
          <p>
            <LocalizedSection zhContent={textsZh.loading} enContent={textsEn.loading} />
          </p>
        </>
      )}
    </div>
  );
}
