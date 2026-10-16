import { useI18n } from '../i18n/index.tsx';
import { useAnyInView } from '../hooks.ts';
import { Icon } from './Icon.tsx';

/** Appears once the hero is out of view; hides near the download card and the footer. */
export function FloatingDownload({ href }: { href: string }) {
  const { t } = useI18n();
  const blocked = useAnyInView(['top', 'download', 'site-footer']);
  return (
    <a className={`fab${blocked ? '' : ' is-shown'}`} href={href} aria-label={t.floating.label} tabIndex={blocked ? -1 : 0} aria-hidden={blocked}>
      <span className="fab__ring" aria-hidden="true" />
      <Icon name="download" size={20} />
      <span className="fab__text">{t.floating.short}</span>
    </a>
  );
}
