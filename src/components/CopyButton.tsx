import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/index.tsx';
import { Icon } from './Icon.tsx';

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  }
}

export function CopyButton({ text, label }: { text: string; label?: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <button
      type="button"
      className={`copy-btn${copied ? ' is-copied' : ''}`}
      onClick={async () => {
        if (await copyText(text)) {
          setCopied(true);
          window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => setCopied(false), 1600);
        }
      }}
    >
      <Icon name={copied ? 'check' : 'copy'} />
      <span className="copy-btn__text" aria-live="polite">
        {copied ? t.a11y.copied : t.a11y.copy}
      </span>
      <span className="visually-hidden">: {label ?? text}</span>
    </button>
  );
}

/** A single copyable command line. Always LTR. */
export function CommandLine({ cmd, prompt = 'PS>' }: { cmd: string; prompt?: string }) {
  return (
    <div className="cmdline" dir="ltr">
      <code>
        <span className="cmdline__prompt" aria-hidden="true">
          {prompt}{' '}
        </span>
        {cmd}
      </code>
      <CopyButton text={cmd} />
    </div>
  );
}
