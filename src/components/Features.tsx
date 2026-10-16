import type { CSSProperties, ReactNode } from 'react';
import { useI18n } from '../i18n/index.tsx';
import { useReveal } from '../hooks.ts';
import { LANGUAGES } from '../sim/engine.ts';
import { LANG_COLORS } from '../langColors.ts';

function Flag({ long, short }: { long: string; short?: string }) {
  return (
    <span className="flag" dir="ltr">
      <code>{long}</code>
      {short && <code className="flag__short">{short}</code>}
    </span>
  );
}

function Tile({ className, flag, title, body, children }: { className: string; flag: ReactNode; title: string; body: string; children?: ReactNode }) {
  return (
    <article className={`tile ${className}`}>
      <div className="tile__head">
        {flag}
        <h3>{title}</h3>
      </div>
      <p>{body}</p>
      {children && (
        <div className="tile__visual" dir="ltr" aria-hidden="true">
          {children}
        </div>
      )}
    </article>
  );
}

export function Features() {
  const { t } = useI18n();
  const f = t.features;
  const gridRef = useReveal<HTMLDivElement>();

  return (
    <section className="section section--light" id="features" aria-labelledby="features-title">
      <div className="container">
        <header className="section-head">
          <h2 id="features-title">{f.title}</h2>
          <p>{f.lead}</p>
        </header>

        <div className="tiles reveal" ref={gridRef}>
          <Tile className="tile--lang" flag={<Flag long="--language" short="-l" />} title={f.languages.title} body={f.languages.body}>
            <div className="chips">
              {LANGUAGES.map((l) => (
                <span key={l.id} className="chip" style={{ '--c': LANG_COLORS[l.id] } as CSSProperties}>
                  <i />
                  {l.id}
                  <small>{l.ext}</small>
                </span>
              ))}
              <span className="chip chip--all">all</span>
            </div>
          </Tile>

          <Tile className="tile--combine" flag={<Flag long="bundle" />} title={f.combine.title} body={f.combine.body}>
            <div className="mini-merge">
              <div className="mini-merge__files">
                {(['CSharp', 'Python', 'TypeScript'] as const).map((id) => (
                  <span key={id} style={{ background: LANG_COLORS[id] }} />
                ))}
              </div>
              <svg viewBox="0 0 60 60" className="mini-merge__arrows">
                <path d="M4 10 C 30 10, 30 30, 56 30 M4 30 H56 M4 50 C 30 50, 30 30, 56 30" />
              </svg>
              <div className="mini-merge__out">
                {(['CSharp', 'Python', 'TypeScript'] as const).map((id) => (
                  <span key={id} style={{ background: LANG_COLORS[id] }} />
                ))}
              </div>
            </div>
          </Tile>

          <Tile className="tile--sm" flag={<Flag long="--output" short="-o" />} title={f.output.title} body={f.output.body}>
            <code className="mini-code">-o C:\review\shop.txt</code>
          </Tile>

          <Tile className="tile--sm" flag={<Flag long="--note" short="-n" />} title={f.note.title} body={f.note.body}>
            <code className="mini-code">
              <span className="c-comment">{'// src\\Models\\Order.cs'}</span>
              {'\n'}namespace DemoShop.Models;
            </code>
          </Tile>

          <Tile className="tile--sm" flag={<Flag long="--sort" short="-s" />} title={f.sort.title} body={f.sort.body}>
            <div className="mini-sort">
              <div>
                <b>name</b>
                <span>api.ts</span>
                <span>app.js</span>
                <span>Order.cs</span>
              </div>
              <div>
                <b>code</b>
                <span>Order.cs</span>
                <span>app.js</span>
                <span>api.ts</span>
              </div>
            </div>
          </Tile>

          <Tile className="tile--sm" flag={<Flag long="--remove-empty-lines" short="-r" />} title={f.remove.title} body={f.remove.body}>
            <div className="mini-lines">
              <span />
              <span className="is-empty" />
              <span />
              <span className="is-empty" />
              <span />
            </div>
          </Tile>

          <Tile className="tile--author" flag={<Flag long="--author" short="-a" />} title={f.author.title} body={f.author.body}>
            <code className="mini-code">
              <span className="c-gold">{'// Your Team'}</span>
              {'\n'}using DemoShop.Services;
            </code>
          </Tile>

          <Tile className="tile--rsp" flag={<Flag long="create-rsp" />} title={f.rsp.title} body={f.rsp.body}>
            <div className="mini-rsp">
              <code>
                <span className="c-dim">PS&gt;</span> mycli create-rsp{'\n'}
                <span className="c-dim">Languages (required, separated by spaces):</span> CSharp{'\n'}
                <span className="c-dim">Output file:</span> bundle.txt{'\n'}
                <span className="c-dim">…</span>
                {'\n'}
                <span className="c-ok">Response file created: mybundle.rsp</span>
                {'\n'}
                <span className="c-dim">PS&gt;</span> mycli @mybundle.rsp
              </code>
            </div>
          </Tile>
        </div>

        <aside className="notes" aria-labelledby="notes-title">
          <h3 id="notes-title">{f.notesTitle}</h3>
          <ul>
            {f.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
