import { useI18n } from '../i18n/index.tsx';
import { RELEASE } from '../config.ts';
import { Icon } from './Icon.tsx';
import { Logo } from './Logo.tsx';

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="site-footer" id="site-footer">
      <div className="container site-footer__inner">
        <div>
          <Logo />
          <p className="site-footer__tag">{t.footer.tagline}</p>
          <p className="site-footer__note">{t.footer.note}</p>
        </div>
        <nav aria-label={t.footer.links}>
          <ul className="site-footer__links">
            <li>
              <a href={RELEASE.repoUrl}>
                <Icon name="github" size={16} />
                {t.footer.source}
              </a>
            </li>
            <li>
              <a href={`${RELEASE.repoUrl}/releases`}>{t.footer.releases}</a>
            </li>
            <li>
              <a href="#install">{t.nav.install}</a>
            </li>
            <li>
              <a href="#faq">{t.nav.faq}</a>
            </li>
          </ul>
        </nav>
      </div>
      <p className="site-footer__legal container">© {new Date().getFullYear()} BundleBloom</p>
    </footer>
  );
}
