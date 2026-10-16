import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCommand, runBundle, runCreateRsp, type BundleOptions } from './engine.ts';

const base: BundleOptions = {
  languages: ['CSharp'],
  output: 'bundle.txt',
  note: false,
  sort: 'name',
  removeEmptyLines: false,
  author: '',
};

test('requires a language', () => {
  const r = runBundle({ ...base, languages: [] });
  assert.equal(r.ok, false);
  assert.deepEqual(r.console, ["Option '--language' is required."]);
});

test('requires an output file', () => {
  const r = runBundle({ ...base, output: ' ' });
  assert.deepEqual(r.console, ['Error: Please specify an output file using --output.']);
});

test('skips bin/obj and unsupported files; sorts by file name', () => {
  const r = runBundle(base);
  assert.equal(r.includedCount, 3);
  const included = r.decisions.filter((d) => d.included).map((d) => d.path);
  assert.deepEqual(included, ['src\\Models\\Order.cs', 'src\\Services\\PriceCalculator.cs', 'src\\Program.cs']);
  assert.ok(r.decisions.some((d) => d.path.startsWith('bin\\') && d.reason === 'excludedFolder'));
  assert.ok(r.decisions.some((d) => d.path.startsWith('obj\\') && d.reason === 'excludedFolder'));
  assert.equal(r.console[0], 'Bundle file was created successfully: C:\\Users\\you\\projects\\demo-shop\\bundle.txt');
});

test('all + sort code orders by extension then name', () => {
  const r = runBundle({ ...base, languages: ['all'], sort: 'code' });
  const included = r.decisions.filter((d) => d.included).map((d) => d.path.split('\\').pop());
  assert.deepEqual(included, [
    'vector.cpp',
    'Order.cs',
    'PriceCalculator.cs',
    'Program.cs',
    'health.go',
    'Checksum.java',
    'app.js',
    'report.py',
    'api.ts',
  ]);
  assert.ok(r.decisions.some((d) => d.path === 'README.md' && d.reason === 'unsupported'));
});

test('author, notes and blank-line layout', () => {
  const r = runBundle({ ...base, languages: ['Go'], note: true, author: 'Team Bloom' });
  assert.equal(r.outputText, '// Team Bloom\n// cmd\\health.go\npackage main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("ok")\n}\n\n\n');
});

test('remove empty lines', () => {
  const r = runBundle({ ...base, languages: ['Python'], removeEmptyLines: true });
  assert.equal(r.outputText, 'import csv\ndef write_report(rows):\n    with open("report.csv", "w") as f:\n        csv.writer(f).writerows(rows)\n');
});

test('command builder', () => {
  const o: BundleOptions = { ...base, languages: ['CSharp', 'Python'], note: true, sort: 'code', removeEmptyLines: true, author: 'Team Bloom' };
  assert.equal(
    buildCommand(o, { shortAliases: false }),
    'mycli bundle --language CSharp Python --output bundle.txt --note --sort code --remove-empty-lines --author "Team Bloom"',
  );
  assert.equal(buildCommand(o, { shortAliases: true }), 'mycli bundle -l CSharp Python -o bundle.txt -n -s code -r -a "Team Bloom"');
});

test('create-rsp writes one argument per line', () => {
  const r = runCreateRsp({ ...base, languages: ['CSharp', 'Python'], note: true, author: 'Team Bloom', rspName: 'mybundle' });
  assert.equal(r.fileName, 'mybundle.rsp');
  assert.equal(r.fileText, 'bundle\n--language\nCSharp\n--language\nPython\n--output\n"bundle.txt"\n--sort\nname\n--note\n--author\n"Team Bloom"');
  assert.equal(r.message, 'Response file created: mybundle.rsp');
});
