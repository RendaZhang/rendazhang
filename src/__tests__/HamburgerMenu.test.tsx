import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';

import HamburgerMenu from '../components/layouts/HamburgerMenu';

const providerState = vi.hoisted(() => ({
  isLoggedIn: false,
  lang: 'en'
}));

vi.mock('../components/providers', () => ({
  useAuth: () => ({ isLoggedIn: providerState.isLoggedIn }),
  useLanguage: () => ({ lang: providerState.lang })
}));

vi.mock('../components/ui', () => ({
  LocalizedSection: ({ zhContent, enContent }: { zhContent: ReactNode; enContent: ReactNode }) => (
    <>
      <span>{zhContent}</span>
      <span>{enContent}</span>
    </>
  )
}));

describe('HamburgerMenu', () => {
  let breakpointHandler: ((event: MediaQueryListEvent) => void) | undefined;

  beforeEach(() => {
    providerState.isLoggedIn = false;
    providerState.lang = 'en';
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    breakpointHandler = undefined;
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        matches: false,
        addEventListener: (_type: string, handler: (event: MediaQueryListEvent) => void) => {
          breakpointHandler = handler;
        },
        removeEventListener: vi.fn()
      })
    );
  });

  it('keeps the closed drawer out of the accessibility and Tab order', () => {
    render(<HamburgerMenu />);

    const trigger = screen.getByRole('button', { name: 'Menu' });
    expect(trigger.getAttribute('aria-controls')).toBe('site-navigation-drawer');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.querySelectorAll('.c-side-menu-link')).toHaveLength(0);
  });

  it('moves focus inside, traps both Tab directions, and includes authenticated navigation', async () => {
    providerState.isLoggedIn = true;
    render(<HamburgerMenu />);

    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
    const closeButton = screen.getByRole('button', { name: /Close navigation/ });
    const links = screen.getAllByRole('link');

    await waitFor(() => expect(document.activeElement).toBe(closeButton));
    expect(links).toHaveLength(5);
    expect(links.at(-1)?.getAttribute('href')).toBe('/profile');

    links.at(-1)?.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(closeButton);

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(links.at(-1));

    const outside = document.createElement('button');
    document.body.append(outside);
    outside.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(closeButton);
    outside.remove();
  });

  it('closes on Escape, restores trigger focus, and restores exact overflow styles', async () => {
    document.body.style.overflow = 'clip';
    document.documentElement.style.overflow = 'auto';
    render(<HamburgerMenu />);

    const trigger = screen.getByRole('button', { name: 'Menu' });
    fireEvent.click(trigger);
    await waitFor(() => expect(document.body.style.overflow).toBe('hidden'));
    expect(document.documentElement.style.overflow).toBe('hidden');

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
    expect(document.body.style.overflow).toBe('clip');
    expect(document.documentElement.style.overflow).toBe('auto');
  });

  it('supports backdrop and visible close-control dismissal', () => {
    render(<HamburgerMenu />);
    const trigger = screen.getByRole('button', { name: 'Menu' });

    fireEvent.click(trigger);
    fireEvent.click(document.querySelector('.c-side-menu-overlay') as HTMLElement);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);

    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('button', { name: /Close navigation/ }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('restores locked document styles and removes the keyboard boundary on cleanup', async () => {
    document.body.style.overflow = 'scroll';
    document.documentElement.style.overflow = 'visible';
    const { unmount } = render(<HamburgerMenu />);

    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
    await waitFor(() => expect(document.body.style.overflow).toBe('hidden'));
    unmount();

    expect(document.body.style.overflow).toBe('scroll');
    expect(document.documentElement.style.overflow).toBe('visible');
    expect(() => fireEvent.keyDown(document, { key: 'Escape' })).not.toThrow();
  });

  it('closes across the desktop breakpoint and clears scroll and keyboard ownership', async () => {
    const removeListener = vi.spyOn(document, 'removeEventListener');
    document.body.style.overflow = 'scroll';
    document.documentElement.style.overflow = 'visible';
    render(<HamburgerMenu />);

    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
    await waitFor(() => expect(document.body.style.overflow).toBe('hidden'));
    act(() => breakpointHandler?.({ matches: true } as MediaQueryListEvent));

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(document.body.style.overflow).toBe('scroll');
    expect(document.documentElement.style.overflow).toBe('visible');
    expect(removeListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    removeListener.mockRestore();
  });
});
