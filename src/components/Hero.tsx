import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/index.tsx';
import { useReducedMotion } from '../hooks.ts';
import { HeroArt } from './HeroArt.tsx';
import { Icon } from './Icon.tsx';
import { ParticleField } from './ParticleField.tsx';

const HERO_CMD = 'mycli bundle -l all -o bundle.txt -n -s code';
const HERO_OUT = 'Bundle file was created successfully: C:\\projects\\demo-shop\\bundle.txt';

function HeroTerminal({ caption }: { caption: string }) {
  const reduced = useReducedMotion();
  const [typed, setTyped] = useState(reduced ? HERO_CMD.length : 0);
  const done = typed >= HERO_CMD.length;

  useEffect(() => {
    if (reduced) {
      setTyped(HERO_CMD.length);
      return;
    }
    let i = 0;
    let timer = window.setTimeout(function tick() {
      i++;
      setTyped(i);
      if (i < HERO_CMD.length) timer = window.setTimeout(tick, 28 + ((i * 7) % 30));
    }, 900);
    return () => window.clearTimeout(timer);
  }, [reduced]);

  return (
    <figure className="hero-term" dir="ltr">
      <div className="term-chrome" aria-hidden="true">
        <span />
        <span />
        <span />
        <em>PowerShell</em>
      </div>
      <pre className="hero-term__body">
        <span className="visually-hidden">{`${HERO_CMD}\n${HERO_OUT}`}</span>
        <span aria-hidden="true">
          <span className="t-prompt">PS C:\projects\demo-shop&gt; </span>
          <span className="t-cmd">{HERO_CMD.slice(0, typed)}</span>
          {!done && <span className="t-caret" />}
          {done && (
            <>
              {'\n'}
              <span className="t-ok">{HERO_OUT}</span>
            </>
          )}
        </span>
      </pre>
      <figcaption className="visually-hidden">{caption}</figcaption>
    </figure>
  );
}

export function Hero({ downloadUrl }: { downloadUrl: string }) {
  const { t } = useI18n();
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <ParticleField />
      <div className="hero__inner">
        <div className="hero__copy">
          <h1 id="hero-title" className="hero__title">
            {t.hero.title}
          </h1>
          <p className="hero__lead">{t.hero.lead}</p>
          <div className="hero__ctas">
            <a className="btn btn--gold btn--lg" href={downloadUrl}>
              <Icon name="windows" />
              <span>{t.hero.download}</span>
            </a>
            <a className="btn btn--ghost btn--lg" href="#demo">
              <Icon name="play" size={16} />
              <span>{t.hero.demo}</span>
            </a>
          </div>
          <ul className="hero__meta">
            {t.hero.meta.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
        <div className="hero__visual">
          <HeroArt label={t.a11y.heroArt} />
          <HeroTerminal caption={t.hero.terminalCaption} />
        </div>
      </div>
    </section>
  );
}
