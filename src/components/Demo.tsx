import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { format, useI18n } from '../i18n/index.tsx';
import { useReducedMotion } from '../hooks.ts';
import {
  LANGUAGES,
  buildCommand,
  extensionOf,
  runBundle,
  runCreateRsp,
  type BundleOptions,
  type BundleResult,
  type LanguageChoice,
  type RspResult,
} from '../sim/engine.ts';
import { PROJECT_ROOT, SAMPLE_FILES } from '../sim/sampleProject.ts';
import { LANG_COLORS } from '../langColors.ts';
import { CopyButton } from './CopyButton.tsx';
import { Icon } from './Icon.tsx';

type Mode = 'bundle' | 'rsp';
type Tab = 'terminal' | 'preview' | 'files';
type PresetId = 'basic' | 'web' | 'everything' | 'compact';

const DEFAULTS: BundleOptions = { languages: ['CSharp'], output: 'bundle.txt', note: false, sort: 'name', removeEmptyLines: false, author: '' };

const PRESETS: Record<PresetId, BundleOptions> = {
  basic: DEFAULTS,
  web: { languages: ['JavaScript', 'TypeScript'], output: 'web-bundle.txt', note: true, sort: 'name', removeEmptyLines: false, author: '' },
  everything: { languages: ['all'], output: 'everything.txt', note: true, sort: 'code', removeEmptyLines: false, author: '' },
  compact: { languages: ['CSharp', 'Python'], output: 'compact.txt', note: false, sort: 'name', removeEmptyLines: true, author: 'Team Bloom' },
};

const OUTPUT_RE = /^(?!\.+$)[A-Za-z0-9 ._-]{1,60}$/;
const AUTHOR_RE = /^[^"\\]{0,40}$/;

interface Line {
  kind: 'cmd' | 'out' | 'err' | 'qa';
  text: string;
  answer?: string;
}

interface RunSnapshot {
  mode: Mode;
  lines: Line[];
  bundle: BundleResult | null;
  rsp: RspResult | null;
  outputName: string;
}

const PROMPT = `PS ${PROJECT_ROOT}>`;

function sameOptions(a: BundleOptions, b: BundleOptions) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function Demo() {
  const { t } = useI18n();
  const d = t.demo;
  const reduced = useReducedMotion();
  const baseId = useId();

  const [mode, setMode] = useState<Mode>('bundle');
  const [opts, setOpts] = useState<BundleOptions>(DEFAULTS);
  const [rspName, setRspName] = useState('mybundle');
  const [shortAliases, setShortAliases] = useState(false);
  const [tab, setTab] = useState<Tab>('terminal');
  const [running, setRunning] = useState(false);
  const [shown, setShown] = useState(0);
  const [snap, setSnap] = useState<RunSnapshot | null>(null);
  const [lastRunKey, setLastRunKey] = useState('');
  const timers = useRef<number[]>([]);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => timers.current.forEach((x) => window.clearTimeout(x)), []);

  const outputValid = OUTPUT_RE.test(opts.output.trim()) || opts.output.trim() === '';
  const authorValid = AUTHOR_RE.test(opts.author);
  const rspValid = OUTPUT_RE.test(rspName.trim()) || rspName.trim() === '';
  const canRun = outputValid && authorValid && (mode === 'bundle' || rspValid) && !running;

  const command = useMemo(() => buildCommand(opts, { shortAliases }), [opts, shortAliases]);
  const runKey = JSON.stringify({ mode, opts, rspName, shortAliases });
  const activePreset = (Object.keys(PRESETS) as PresetId[]).find((k) => sameOptions(PRESETS[k], opts));

  const update = <K extends keyof BundleOptions>(key: K, value: BundleOptions[K]) => setOpts((o) => ({ ...o, [key]: value }));

  const toggleLanguage = (lang: LanguageChoice) => {
    setOpts((o) => {
      const has = o.languages.includes(lang);
      const languages = has ? o.languages.filter((l) => l !== lang) : [...o.languages, lang];
      // Keep the order users would type them in: canonical order, "all" last.
      const order: LanguageChoice[] = [...LANGUAGES.map((l) => l.id), 'all'];
      languages.sort((a, b) => order.indexOf(a) - order.indexOf(b));
      return { ...o, languages };
    });
  };

  const run = () => {
    if (!canRun) return;
    timers.current.forEach((x) => window.clearTimeout(x));
    timers.current = [];

    let lines: Line[];
    let bundle: BundleResult | null = null;
    let rsp: RspResult | null = null;
    if (mode === 'bundle') {
      bundle = runBundle(opts);
      lines = [{ kind: 'cmd', text: command }, ...bundle.console.map((text) => ({ kind: bundle?.ok ? 'out' : 'err', text }) as Line)];
    } else {
      rsp = runCreateRsp({ ...opts, rspName });
      lines = [{ kind: 'cmd', text: 'mycli create-rsp' }, ...rsp.transcript.map((q) => ({ kind: 'qa', text: q.prompt, answer: q.answer }) as Line)];
      lines.push({ kind: rsp.ok ? 'out' : 'err', text: rsp.message });
      if (rsp.ok) {
        bundle = runBundle(opts);
        lines.push({ kind: 'cmd', text: `mycli @${rsp.fileName}` }, ...bundle.console.map((text) => ({ kind: bundle?.ok ? 'out' : 'err', text }) as Line));
      }
    }

    setSnap({ mode, lines, bundle, rsp, outputName: opts.output.trim() });
    setLastRunKey(runKey);
    setTab('terminal');

    if (reduced) {
      setShown(lines.length);
      return;
    }
    setRunning(true);
    setShown(0);
    let delay = 120;
    lines.forEach((line, i) => {
      delay += line.kind === 'cmd' ? (i === 0 ? 260 : 520) : line.kind === 'qa' ? 170 : 380;
      timers.current.push(window.setTimeout(() => setShown(i + 1), delay));
    });
    timers.current.push(window.setTimeout(() => setRunning(false), delay + 60));
  };

  useEffect(() => {
    termRef.current?.scrollTo({ top: termRef.current.scrollHeight });
  }, [shown]);

  const total = SAMPLE_FILES.length;
  const finished = snap !== null && !running;
  const stale = snap !== null && lastRunKey !== runKey;
  const bundle = snap?.bundle ?? null;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'terminal', label: d.tabTerminal },
    { id: 'preview', label: d.tabPreview },
    { id: 'files', label: d.tabFiles },
  ];

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const idx = tabs.findIndex((x) => x.id === tab);
    let next = idx;
    const rtl = document.documentElement.dir === 'rtl';
    if (e.key === (rtl ? 'ArrowLeft' : 'ArrowRight')) next = (idx + 1) % tabs.length;
    else if (e.key === (rtl ? 'ArrowRight' : 'ArrowLeft')) next = (idx - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    else return;
    e.preventDefault();
    const target = tabs[next];
    if (target) {
      setTab(target.id);
      document.getElementById(`${baseId}-tab-${target.id}`)?.focus();
    }
  };

  const statusText = finished && bundle?.ok ? format(d.summary, { count: bundle.includedCount, total }) : '';

  return (
    <section className="section section--dark demo" id="demo" aria-labelledby="demo-title">
      <div className="container">
        <header className="section-head section-head--dark">
          <span className="badge">
            <Icon name="play" size={12} />
            {d.badge}
          </span>
          <h2 id="demo-title">{d.title}</h2>
          <p>{d.lead}</p>
        </header>

        <div className="demo__bar">
          <div className="seg" role="radiogroup" aria-label={d.modeLabel}>
            {(['bundle', 'rsp'] as const).map((m) => (
              <button key={m} type="button" role="radio" aria-checked={mode === m} className="seg__btn" dir="ltr" onClick={() => setMode(m)}>
                <code>mycli {m === 'bundle' ? d.modeBundle : d.modeRsp}</code>
              </button>
            ))}
          </div>
          <div className="presets" role="group" aria-label={d.presetsLabel}>
            <span className="presets__label">{d.presetsLabel}</span>
            {(Object.keys(PRESETS) as PresetId[]).map((p) => (
              <button key={p} type="button" className="preset" aria-pressed={activePreset === p} onClick={() => setOpts(PRESETS[p])}>
                {d.presets[p]}
              </button>
            ))}
          </div>
        </div>

        <div className="demo__grid">
          <form
            className="controls"
            onSubmit={(e) => {
              e.preventDefault();
              run();
            }}
          >
            <fieldset className="field">
              <legend>
                <span className="field__label">{d.languagesLabel}</span>
                <code dir="ltr">--language</code>
              </legend>
              <p className="field__hint">{d.explain.language}</p>
              <div className="lang-toggles">
                {LANGUAGES.map((l) => (
                  <label key={l.id} className="ltoggle" style={{ '--c': LANG_COLORS[l.id] } as CSSProperties}>
                    <input type="checkbox" checked={opts.languages.includes(l.id)} onChange={() => toggleLanguage(l.id)} />
                    <span dir="ltr">
                      <i />
                      {l.id}
                    </span>
                  </label>
                ))}
                <label className="ltoggle ltoggle--all">
                  <input type="checkbox" checked={opts.languages.includes('all')} onChange={() => toggleLanguage('all')} />
                  <span dir="ltr">{d.allLabel}</span>
                </label>
              </div>
              {opts.languages.length === 0 && <p className="field__warn">{d.languagesHint}</p>}
            </fieldset>

            <div className="field">
              <label htmlFor={`${baseId}-out`} className="field__row">
                <span className="field__label">{d.outputLabel}</span>
                <code dir="ltr">--output</code>
              </label>
              <p className="field__hint" id={`${baseId}-out-hint`}>
                {d.explain.output}
              </p>
              <input
                id={`${baseId}-out`}
                className="input"
                dir="ltr"
                value={opts.output}
                placeholder="bundle.txt"
                aria-describedby={`${baseId}-out-hint${outputValid ? '' : ` ${baseId}-out-err`}`}
                aria-invalid={!outputValid}
                spellCheck={false}
                autoComplete="off"
                onChange={(e) => update('output', e.target.value)}
              />
              {!outputValid && (
                <p className="field__warn" id={`${baseId}-out-err`}>
                  {d.outputInvalid}
                </p>
              )}
            </div>

            <div className="field">
              <span className="field__row">
                <span className="field__label" id={`${baseId}-sort`}>
                  {d.sortLabel}
                </span>
                <code dir="ltr">--sort</code>
              </span>
              <p className="field__hint">{d.explain.sort}</p>
              <div className="seg seg--small" role="radiogroup" aria-labelledby={`${baseId}-sort`}>
                {(['name', 'code'] as const).map((s) => (
                  <button key={s} type="button" role="radio" aria-checked={opts.sort === s} className="seg__btn" onClick={() => update('sort', s)}>
                    <span>{s === 'name' ? d.sortName : d.sortCode}</span>
                    <code dir="ltr">{s}</code>
                  </button>
                ))}
              </div>
            </div>

            <div className="field field--switches">
              <label className="switch">
                <input type="checkbox" checked={opts.note} onChange={(e) => update('note', e.target.checked)} />
                <span className="switch__track" aria-hidden="true" />
                <span className="switch__text">
                  <span className="field__label">
                    {d.noteLabel} <code dir="ltr">--note</code>
                  </span>
                  <span className="field__hint">{d.explain.note}</span>
                </span>
              </label>
              <label className="switch">
                <input type="checkbox" checked={opts.removeEmptyLines} onChange={(e) => update('removeEmptyLines', e.target.checked)} />
                <span className="switch__track" aria-hidden="true" />
                <span className="switch__text">
                  <span className="field__label">
                    {d.removeLabel} <code dir="ltr">--remove-empty-lines</code>
                  </span>
                  <span className="field__hint">{d.explain.remove}</span>
                </span>
              </label>
            </div>

            <div className="field">
              <label htmlFor={`${baseId}-author`} className="field__row">
                <span className="field__label">
                  {d.authorLabel} <small>({d.authorHint})</small>
                </span>
                <code dir="ltr">--author</code>
              </label>
              <p className="field__hint">{d.explain.author}</p>
              <input
                id={`${baseId}-author`}
                className="input"
                value={opts.author}
                maxLength={40}
                aria-invalid={!authorValid}
                autoComplete="off"
                onChange={(e) => update('author', e.target.value)}
              />
            </div>

            {mode === 'rsp' && (
              <div className="field">
                <label htmlFor={`${baseId}-rsp`} className="field__row">
                  <span className="field__label">{d.rspNameLabel}</span>
                  <code dir="ltr">.rsp</code>
                </label>
                <input
                  id={`${baseId}-rsp`}
                  className="input"
                  dir="ltr"
                  value={rspName}
                  aria-invalid={!rspValid}
                  spellCheck={false}
                  autoComplete="off"
                  onChange={(e) => setRspName(e.target.value)}
                />
                {!rspValid && <p className="field__warn">{d.outputInvalid}</p>}
              </div>
            )}

            {mode === 'bundle' && (
              <label className="switch switch--quiet">
                <input type="checkbox" checked={shortAliases} onChange={(e) => setShortAliases(e.target.checked)} />
                <span className="switch__track" aria-hidden="true" />
                <span className="switch__text">
                  <span className="field__label">
                    {d.aliasesLabel} <code dir="ltr">-l -o -n -s -r -a</code>
                  </span>
                </span>
              </label>
            )}
          </form>

          <div className="console">
            <div className="console__cmd" dir="ltr">
              <span className="console__cmdlabel">{d.commandLabel}</span>
              <code>{mode === 'bundle' ? command : 'mycli create-rsp'}</code>
              <CopyButton text={mode === 'bundle' ? command : 'mycli create-rsp'} label={t.a11y.copyCommand} />
            </div>

            <div className="console__window">
              <div className="console__top">
                <div className="term-chrome" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="console__tabs" role="tablist" aria-label={d.terminalLabel}>
                  {tabs.map((x) => (
                    <button
                      key={x.id}
                      id={`${baseId}-tab-${x.id}`}
                      type="button"
                      role="tab"
                      aria-selected={tab === x.id}
                      aria-controls={`${baseId}-panel-${x.id}`}
                      tabIndex={tab === x.id ? 0 : -1}
                      className="console__tab"
                      onClick={() => setTab(x.id)}
                      onKeyDown={onTabKey}
                    >
                      {x.label}
                    </button>
                  ))}
                </div>
                <button type="button" className={`btn btn--run${running ? ' is-running' : ''}`} onClick={run} disabled={!canRun}>
                  <Icon name="play" size={14} />
                  <span>{running ? d.running : stale || !snap ? d.run : d.runAgain}</span>
                </button>
              </div>

              <div
                id={`${baseId}-panel-terminal`}
                role="tabpanel"
                aria-labelledby={`${baseId}-tab-terminal`}
                hidden={tab !== 'terminal'}
                className="console__panel console__term"
                dir="ltr"
                ref={termRef}
                tabIndex={0}
              >
                {!snap && <p className="console__idle" dir="auto">{d.idle}</p>}
                {snap?.lines.slice(0, shown).map((line, i) => (
                  <div key={i} className={`tl tl--${line.kind}`}>
                    {line.kind === 'cmd' && <span className="t-prompt">{PROMPT} </span>}
                    <span>{line.text}</span>
                    {line.kind === 'qa' && <span className="t-answer">{line.answer}</span>}
                  </div>
                ))}
                {running && <span className="t-caret" aria-hidden="true" />}
                {finished && (
                  <div className="tl">
                    <span className="t-prompt">{PROMPT} </span>
                    <span className="t-caret t-caret--idle" aria-hidden="true" />
                  </div>
                )}
              </div>

              <div
                id={`${baseId}-panel-preview`}
                role="tabpanel"
                aria-labelledby={`${baseId}-tab-preview`}
                hidden={tab !== 'preview'}
                className="console__panel"
                tabIndex={0}
              >
                {!finished || !bundle?.ok ? (
                  <p className="console__idle">{d.previewEmpty}</p>
                ) : (
                  <div dir="ltr">
                    {snap?.rsp?.ok && <FilePreview name={snap.rsp.fileName} text={snap.rsp.fileText} />}
                    <FilePreview name={snap?.outputName ?? ''} text={bundle.outputText} />
                    {bundle.includedCount === 0 && <p className="console__idle">{d.noFiles}</p>}
                  </div>
                )}
              </div>

              <div
                id={`${baseId}-panel-files`}
                role="tabpanel"
                aria-labelledby={`${baseId}-tab-files`}
                hidden={tab !== 'files'}
                className="console__panel"
                tabIndex={0}
              >
                <p className="files__root" dir="ltr">
                  {d.projectLabel}: {PROJECT_ROOT}
                </p>
                <ul className="files">
                  {(finished && bundle?.ok ? bundle.decisions : SAMPLE_FILES.map((f) => ({ path: f.path, included: undefined, reason: undefined }))).map((f) => {
                    const ext = extensionOf(f.path);
                    const lang = LANGUAGES.find((l) => l.ext === ext);
                    const status =
                      f.included === true
                        ? d.included
                        : f.reason === 'excludedFolder'
                          ? d.skippedExcluded
                          : f.reason === 'unsupported'
                            ? d.skippedUnsupported
                            : f.reason === 'notSelected'
                              ? d.skippedNotSelected
                              : '';
                    return (
                      <li key={f.path} className={f.included === true ? 'is-in' : f.included === false ? 'is-out' : ''}>
                        <i style={{ background: lang ? LANG_COLORS[lang.id] : 'var(--muted-2)' }} aria-hidden="true" />
                        <code dir="ltr">{f.path}</code>
                        {status && <span className="files__status">{status}</span>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="console__foot">
              <p aria-live="polite" className="console__status">
                {statusText}
              </p>
              <p className="console__simnote">{d.simNote}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FilePreview({ name, text }: { name: string; text: string }) {
  const lines = text.split('\n');
  if (lines[lines.length - 1] === '') lines.pop();
  return (
    <figure className="preview">
      <figcaption>
        <Icon name="file" size={14} />
        {name}
      </figcaption>
      <pre>
        {lines.map((l, i) => (
          <span key={i} className={`pl${l.startsWith('// ') ? ' pl--comment' : ''}`}>
            {l || ' '}
            {'\n'}
          </span>
        ))}
      </pre>
    </figure>
  );
}
