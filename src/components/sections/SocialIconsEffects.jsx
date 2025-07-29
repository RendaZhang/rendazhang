import { useEffect } from 'react';

export default function SocialIconsEffects() {
  useEffect(() => {
    const wechatLink = document.getElementById('wechatLink');
    const modal = document.getElementById('wechatModal');
    if (!wechatLink || !modal) return;
    const closeBtn = modal.querySelector('.close');
    const qrImg = document.getElementById('wechatQR');
    const loader = modal.querySelector('.loader');

    const openModal = (event) => {
      if (event) event.preventDefault();
      modal.style.display = 'flex';
      loader.style.display = 'block';
      qrImg.style.display = 'none';
      if (!qrImg.getAttribute('src')) {
        qrImg.setAttribute('src', qrImg.getAttribute('data-src'));
      }
      if (!qrImg.complete) {
        qrImg.onload = () => {
          loader.style.display = 'none';
          qrImg.style.display = 'block';
        };
      } else {
        loader.style.display = 'none';
        qrImg.style.display = 'block';
      }
    };

    const closeModal = () => {
      modal.style.display = 'none';
    };

    const onModalClick = (e) => {
      if (e.target === modal) closeModal();
    };

    wechatLink.addEventListener('mouseenter', openModal);
    wechatLink.addEventListener('click', openModal);
    wechatLink.addEventListener('touchstart', openModal);
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', onModalClick);

    return () => {
      wechatLink.removeEventListener('mouseenter', openModal);
      wechatLink.removeEventListener('click', openModal);
      wechatLink.removeEventListener('touchstart', openModal);
      closeBtn.removeEventListener('click', closeModal);
      modal.removeEventListener('click', onModalClick);
    };
  }, []);

  return null;
}
