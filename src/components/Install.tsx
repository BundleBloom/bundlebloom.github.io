import { format, useI18n } from '../i18n/index.tsx';
import { useReveal } from '../hooks.ts';
import { RELEASE } from '../config.ts';
import { CommandLine } from './CopyButton.tsx';
import { Icon } from './Icon.tsx';

const STEP_CMDS: (string | null)[] = [null, 'mycli --help', 'cd C:\\path\\to\\your-project', 'mycli bundle --language CSharp --output bundle.txt --note'];

export function Install() {
  const { t } = useI18n();
  const i = t.install;
  const stepsRef = useReveal<HTMLOListElement>();

  return (
    <section className="section section--light install" id="install" aria-labelledby="install-title">
      <div className="container">
        <header className="section-head">
          <h2 id="install-title">{i.title}</h2>
          <p>{i.lead}</p>
        </header>

        <div className="install__grid">
          <div className="dl-card" id="download">
            <div className="dl-card__glow" aria-hidden="true" />
            <Icon name="windows" size={34} />
            <h3>{format(i.downloadTitle, { version: RELEASE.version })}</h3>
            <p>{i.downloadMeta}</p>
            <a className="btn btn--gold btn--lg dl-card__main" href={RELEASE.installerUrl}>
              <Icon name="download" />
              <span>{i.downloadInstaller}</span>
            </a>
            <div className="dl-card__alt">
              <a href={RELEASE.zipUrl}>{i.downloadZip}</a>
              <a href={RELEASE.tagUrl}>{i.releaseNotes}</a>
            </div>
            <p className="dl-card__file" dir="ltr">
              {RELEASE.installerName}
            </p>
          </div>

          <ol className="steps reveal" ref={stepsRef}>
            {i.steps.map((s, idx) => {
              const cmd = STEP_CMDS[idx];
              return (
                <li key={s.title} className="step">
                  <span className="step__num" aria-hidden="true">
                    {idx + 1}
                  </span>
                  <div className="step__body">
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                    {cmd && <CommandLine cmd={cmd} />}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="install__more">
          <div className="examples">
            <h3>{i.moreExamples}</h3>
            <ul>
              {i.examples.map((ex) => (
                <li key={ex.cmd}>
                  <span>{ex.label}</span>
                  <CommandLine cmd={ex.cmd} />
                </li>
              ))}
            </ul>
            <h3 className="examples__portable">{i.portableTitle}</h3>
            <p>{i.portableBody}</p>
          </div>

          <div className="trouble">
            <h3>{i.troubleTitle}</h3>
            {i.trouble.map((x) => (
              <details key={x.q} className="disclosure">
                <summary>
                  <span>{x.q}</span>
                  <Icon name="chevron" />
                </summary>
                <p>{x.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
