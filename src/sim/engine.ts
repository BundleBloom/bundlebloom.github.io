// Deterministic re-implementation of `mycli` behaviour, used only for the
// in-browser demo. It mirrors Program.cs from the original C# project:
//  - recursive scan, skipping any folder named bin / obj / Debug / Release
//  - only supported extensions; "all" selects every supported extension
//  - sort "name" (default) by file name, "code" by extension then file name
//  - optional "// author" first line and "// relative\path" notes
//  - each file is written with WriteLine; a blank line follows unless
//    --remove-empty-lines is set (which drops whitespace-only lines)

import { PROJECT_ROOT, SAMPLE_FILES, type SampleFile } from './sampleProject.ts';

export const LANGUAGES = [
  { id: 'CSharp', ext: '.cs' },
  { id: 'Java', ext: '.java' },
  { id: 'Python', ext: '.py' },
  { id: 'JavaScript', ext: '.js' },
  { id: 'TypeScript', ext: '.ts' },
  { id: 'Cpp', ext: '.cpp' },
  { id: 'Go', ext: '.go' },
] as const;

export type LanguageId = (typeof LANGUAGES)[number]['id'];
export type LanguageChoice = LanguageId | 'all';
export type SortMode = 'name' | 'code';

export interface BundleOptions {
  languages: LanguageChoice[];
  output: string;
  note: boolean;
  sort: SortMode;
  removeEmptyLines: boolean;
  author: string;
}

export type SkipReason = 'excludedFolder' | 'unsupported' | 'notSelected';

export interface FileDecision {
  path: string;
  included: boolean;
  reason?: SkipReason;
}

export interface BundleResult {
  ok: boolean;
  /** Exact lines the real CLI prints to the console. */
  console: string[];
  /** Contents of the generated output file (empty when ok is false). */
  outputText: string;
  outputPath: string;
  decisions: FileDecision[];
  includedCount: number;
}

const EXCLUDED_DIRS = ['bin', 'obj', 'debug', 'release'];
const SUPPORTED_EXTS: readonly string[] = LANGUAGES.map((l) => l.ext);

// .NET's default string ordering is culture-aware; Intl.Collator('en') matches it for these names.
const collator = new Intl.Collator('en');

export function extensionOf(path: string): string {
  const name = fileNameOf(path);
  const dot = name.lastIndexOf('.');
  return dot <= 0 ? '' : name.slice(dot).toLowerCase();
}

export function fileNameOf(path: string): string {
  const parts = path.split('\\');
  return parts[parts.length - 1] ?? path;
}

function inExcludedFolder(path: string): boolean {
  return path
    .split('\\')
    .slice(0, -1)
    .some((folder) => EXCLUDED_DIRS.includes(folder.toLowerCase()));
}

function selectedExtensions(languages: readonly LanguageChoice[]): Set<string> {
  const set = new Set<string>();
  for (const lang of languages) {
    if (lang === 'all') continue;
    const found = LANGUAGES.find((l) => l.id === lang);
    if (found) set.add(found.ext);
  }
  return set;
}

export function quoteIfNeeded(value: string): string {
  return /[\s"]/.test(value) ? `"${value.replace(/"/g, '\\"')}"` : value;
}

export function resolveOutputPath(output: string): string {
  if (/^[a-zA-Z]:\\/.test(output)) return output;
  return `${PROJECT_ROOT}\\${output.replace(/\//g, '\\')}`;
}

export interface CommandStyle {
  shortAliases: boolean;
}

/** Builds the command line exactly as a user would type it. */
export function buildCommand(o: BundleOptions, style: CommandStyle): string {
  const f = (long: string, short: string) => (style.shortAliases ? short : long);
  const parts = ['mycli', 'bundle'];
  if (o.languages.length > 0) parts.push(f('--language', '-l'), ...o.languages);
  if (o.output.trim()) parts.push(f('--output', '-o'), quoteIfNeeded(o.output.trim()));
  if (o.note) parts.push(f('--note', '-n'));
  if (o.sort === 'code') parts.push(f('--sort', '-s'), 'code');
  if (o.removeEmptyLines) parts.push(f('--remove-empty-lines', '-r'));
  if (o.author.trim()) parts.push(f('--author', '-a'), quoteIfNeeded(o.author.trim()));
  return parts.join(' ');
}

export function runBundle(o: BundleOptions, files: readonly SampleFile[] = SAMPLE_FILES): BundleResult {
  const output = o.output.trim();
  const outputPath = output ? resolveOutputPath(output) : '';

  if (o.languages.length === 0) {
    return { ok: false, console: ["Option '--language' is required."], outputText: '', outputPath, decisions: [], includedCount: 0 };
  }
  if (!output) {
    return {
      ok: false,
      console: ['Error: Please specify an output file using --output.'],
      outputText: '',
      outputPath,
      decisions: [],
      includedCount: 0,
    };
  }

  const exts = selectedExtensions(o.languages);
  const includeAll = o.languages.includes('all');

  const scanned = files.filter((f) => !inExcludedFolder(f.path));
  const sorted = [...scanned].sort((a, b) => {
    if (o.sort === 'code') {
      const byExt = collator.compare(extensionOf(a.path), extensionOf(b.path));
      if (byExt !== 0) return byExt;
    }
    return collator.compare(fileNameOf(a.path), fileNameOf(b.path));
  });

  const decisions: FileDecision[] = files
    .filter((f) => inExcludedFolder(f.path))
    .map((f) => ({ path: f.path, included: false, reason: 'excludedFolder' as const }));

  let text = '';
  const author = o.author.trim();
  if (author) text += `// ${author}\n`;

  let includedCount = 0;
  for (const file of sorted) {
    if (resolveOutputPath(file.path).toLowerCase() === outputPath.toLowerCase()) continue;
    const ext = extensionOf(file.path);
    if (!SUPPORTED_EXTS.includes(ext)) {
      decisions.push({ path: file.path, included: false, reason: 'unsupported' });
      continue;
    }
    if (!includeAll && !exts.has(ext)) {
      decisions.push({ path: file.path, included: false, reason: 'notSelected' });
      continue;
    }
    decisions.push({ path: file.path, included: true });
    includedCount++;

    if (o.note) text += `// ${file.path}\n`;
    let content = file.content;
    if (o.removeEmptyLines) {
      content = content
        .split(/\r\n|\n|\r/)
        .filter((line) => line.trim() !== '')
        .join('\n');
    }
    text += `${content}\n`;
    if (!o.removeEmptyLines) text += '\n';
  }

  // Included files first in written order, then skipped ones.
  decisions.sort((a, b) => Number(b.included) - Number(a.included));

  return {
    ok: true,
    console: [`Bundle file was created successfully: ${outputPath}`],
    outputText: text,
    outputPath,
    decisions,
    includedCount,
  };
}

// ---------------- create-rsp ----------------

export interface RspInput extends BundleOptions {
  rspName: string;
}

export interface RspResult {
  ok: boolean;
  /** Interactive transcript: prompt + typed answer, followed by the result line. */
  transcript: { prompt: string; answer: string }[];
  message: string;
  fileName: string;
  fileText: string;
}

/** Mirrors QuoteArgument in Program.cs (wraps in quotes, escapes \ and "). */
function quoteArgument(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

export function runCreateRsp(i: RspInput): RspResult {
  const transcript: RspResult['transcript'] = [];
  const fail = (message: string): RspResult => ({ ok: false, transcript, message, fileName: '', fileText: '' });

  const langs = i.languages.join(' ');
  transcript.push({ prompt: 'Languages (required, separated by spaces): ', answer: langs });
  if (!langs) return fail('Error: Language is required.');

  const output = i.output.trim();
  transcript.push({ prompt: 'Output file: ', answer: output });
  if (!output) return fail('Error: Output file is required to create a bundle.');

  transcript.push({ prompt: 'Sort (name/code, default name): ', answer: i.sort === 'code' ? 'code' : '' });
  transcript.push({ prompt: 'Add file path notes? (y/n): ', answer: i.note ? 'y' : 'n' });
  transcript.push({ prompt: 'Remove empty lines? (y/n): ', answer: i.removeEmptyLines ? 'y' : 'n' });
  const author = i.author.trim();
  transcript.push({ prompt: 'Author (optional): ', answer: author });

  const rspRaw = i.rspName.trim();
  transcript.push({ prompt: 'Response file name: ', answer: rspRaw });
  if (!rspRaw) return fail('Error: Response file name is required.');
  const fileName = rspRaw.toLowerCase().endsWith('.rsp') ? rspRaw : `${rspRaw}.rsp`;

  const args = ['bundle'];
  for (const l of i.languages) args.push('--language', l);
  args.push('--output', quoteArgument(output));
  args.push('--sort', i.sort);
  if (i.note) args.push('--note');
  if (i.removeEmptyLines) args.push('--remove-empty-lines');
  if (author) args.push('--author', quoteArgument(author));

  return { ok: true, transcript, message: `Response file created: ${fileName}`, fileName, fileText: args.join('\n') };
}
