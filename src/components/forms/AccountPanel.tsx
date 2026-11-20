import { useEffect, useRef, type ReactNode } from 'react';
import LocalizedSection from '../ui/data-display/LocalizedSection';
import { LOADING_TEXT } from '../../constants/meta';

interface AccountPanelProps {
  titleZh: string;
  titleEn: string;
  focusTitle?: boolean;
  busy?: boolean;
  statusText?: { zh: string; en: string };
  children: ReactNode;
}

export default function AccountPanel({
  titleZh,
  titleEn,
  focusTitle = false,
  busy,
  statusText,
  children
}: AccountPanelProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (focusTitle) titleRef.current?.focus();
  }, [focusTitle, titleEn, titleZh]);

  return (
    <section className="c-account-panel" aria-labelledby="account-title">
      <h1 className="c-account-title" id="account-title" ref={titleRef} tabIndex={-1}>
        <LocalizedSection zhContent={titleZh} enContent={titleEn} />
      </h1>
      {(busy !== undefined || statusText) && (
        <span className="c-account-announcement" role="status">
          {busy ? (
            <LocalizedSection zhContent={LOADING_TEXT.ZH} enContent={LOADING_TEXT.EN} />
          ) : statusText ? (
            <LocalizedSection zhContent={statusText.zh} enContent={statusText.en} />
          ) : null}
        </span>
      )}
      {children}
    </section>
  );
}

export function focusFirstAccountError(form: HTMLFormElement) {
  requestAnimationFrame(() => {
    form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  });
}
