import { useI18n } from '../i18n/index.tsx';
import { Icon } from './Icon.tsx';

export function Faq() {
  const { t } = useI18n();
  return (
    <section className="section section--dark faq" id="faq" aria-labelledby="faq-title">
      <div className="container container--narrow">
        <header className="section-head section-head--dark">
          <h2 id="faq-title">{t.faq.title}</h2>
        </header>
        <div className="faq__list">
          {t.faq.items.map((item) => (
            <details key={item.q} className="disclosure disclosure--dark">
              <summary>
                <span>{item.q}</span>
                <Icon name="chevron" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
