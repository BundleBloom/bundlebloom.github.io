import { useEffect, useId, useRef, useState } from 'react';
import { LOCALES, useI18n } from '../i18n/index.tsx';
import { Icon } from './Icon.tsx';
import { Logo } from './Logo.tsx';

function LanguageSwitcher() {
  const { t, locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    wrapRef.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus();
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const current = LOCALES.find((l) => l.id === locale);

  return (
    <div className="lang" ref={wrapRef}>
      <button
        ref={buttonRef}
        type="button"
        className="lang__btn"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${t.a11y.language}: ${current?.label ?? ''}`}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name="globe" />
        <span className="lang__code">{locale.toUpperCase()}</span>
      </button>
      {open && (
        <div className="lang__menu" id={menuId} role="menu" aria-label={t.a11y.language}>
          {LOCALES.map((l) => (
            <button
              key={l.id}
              type="button"
              role="menuitemradio"
              aria-checked={l.id === locale}
              lang={l.id}
              dir={l.dir}
              className="lang__item"
              onClick={() => {
                setLocale(l.id);
                setOpen(false);
                buttonRef.current?.focus();
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                  e.preventDefault();
                  const items = Array.from(wrapRef.current?.querySelectorAll<HTMLButtonElement>('.lang__item') ?? []);
                  const idx = items.indexOf(e.currentTarget);
                  const next = items[(idx + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length];
                  next?.focus();
                }
              }}
            >
              <span>{l.label}</span>
              {l.id === locale && <Icon name="check" size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header({ downloadUrl }: { downloadUrl: string }) {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const links = [
    { href: '#features', label: t.nav.features },
    { href: '#demo', label: t.nav.demo },
    { href: '#install', label: t.nav.install },
    { href: '#faq', label: t.nav.faq },
  ];

  return (
    <header className={`site-header${scrolled || menuOpen ? ' is-solid' : ''}`}>
      <div className="site-header__inner">
        <a href="#top" className="site-header__brand" aria-label="BundleBloom">
          <Logo />
        </a>
        <nav aria-label={t.a11y.mainNav} className={`site-nav${menuOpen ? ' is-open' : ''}`} id="site-nav">
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setMenuOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="site-header__actions">
          <LanguageSwitcher />
          <a className="btn btn--gold btn--sm site-header__dl" href={downloadUrl} aria-label={t.nav.download}>
            <Icon name="download" size={16} />
            <span>{t.nav.download}</span>
          </a>
          <button
            type="button"
            className="menu-btn"
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            aria-label={menuOpen ? t.a11y.closeMenu : t.a11y.menu}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
    </header>
  );
}
