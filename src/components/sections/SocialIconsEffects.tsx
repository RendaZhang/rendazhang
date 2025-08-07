import { useEffect } from 'react';

export default function SocialIconsEffects(): null {
  useEffect(() => {
    const wechatLink = document.getElementById('wechatLink');
    const modal = document.getElementById('wechatModal');
    if (!(wechatLink instanceof HTMLElement) || !(modal instanceof HTMLElement)) return;
    const closeBtn = modal.querySelector('.close') as HTMLElement | null;
    const qrImg = document.getElementById('wechatQR') as HTMLImageElement | null;
    const loader = modal.querySelector('.loader') as HTMLElement | null;

    const openModal = (event?: Event): void => {
      event?.preventDefault();
      modal.style.display = 'flex';
      if (loader) loader.style.display = 'block';
      if (qrImg) {
        qrImg.style.display = 'none';
        if (!qrImg.getAttribute('src')) {
          qrImg.setAttribute('src', qrImg.getAttribute('data-src') || '');
        }
        if (!qrImg.complete) {
          qrImg.onload = () => {
            if (loader) loader.style.display = 'none';
            qrImg.style.display = 'block';
          };
        } else {
          if (loader) loader.style.display = 'none';
          qrImg.style.display = 'block';
        }
      }
    };

    const closeModal = (): void => {
      modal.style.display = 'none';
    };

    const onModalClick = (e: MouseEvent): void => {
      if (e.target === modal) closeModal();
    };

    wechatLink.addEventListener('mouseenter', openModal);
    wechatLink.addEventListener('click', openModal);
    wechatLink.addEventListener('touchstart', openModal);
    closeBtn?.addEventListener('click', closeModal);
    modal.addEventListener('click', onModalClick);

    return () => {
      wechatLink.removeEventListener('mouseenter', openModal);
      wechatLink.removeEventListener('click', openModal);
      wechatLink.removeEventListener('touchstart', openModal);
      closeBtn?.removeEventListener('click', closeModal);
      modal.removeEventListener('click', onModalClick);
    };
  }, []);

  return null;
}
