export const en = {
  meta: {
    title: 'BundleBloom — bundle your source files into one',
    description:
      'BundleBloom is a free Windows command-line tool that gathers the source files of a project into one organized text file.',
  },
  a11y: {
    skip: 'Skip to content',
    language: 'Change language',
    menu: 'Menu',
    closeMenu: 'Close menu',
    copy: 'Copy',
    copied: 'Copied',
    mainNav: 'Main',
    heroArt: 'Seven source files in different languages flowing into a single bundle file',
  },
  nav: {
    features: 'Features',
    demo: 'Try the demo',
    install: 'Install',
    faq: 'FAQ',
    download: 'Download',
  },
  hero: {
    title: 'Your whole project, gathered into one file.',
    lead:
      'BundleBloom is a small Windows command-line tool. Point it at a project folder, choose the languages you care about, and it writes every matching source file into a single, tidy text file — ready to review, archive, document, or paste into an AI assistant.',
    download: 'Download for Windows',
    demo: 'Try it in the browser',
    meta: ['Free', 'Windows 10 and 11, 64-bit', 'No .NET install needed'],
    terminalCaption: 'A typical run',
  },
  features: {
    title: 'What the command does',
    lead: 'Every feature below is a real option of the installed command, mycli. Combine them freely.',
    languages: {
      title: 'Pick the languages',
      body: 'Name one or more languages, or use all. Matching is by file extension and is not case-sensitive.',
    },
    combine: {
      title: 'Combine into one file',
      body: 'Searches the current folder and every subfolder, then writes each matching file into the bundle, one after another.',
    },
    output: {
      title: 'Choose the output file',
      body: 'Give a file name or a full path. The bundle itself is never included in its own contents.',
    },
    note: {
      title: 'Mark where code came from',
      body: 'Adds a comment with the file’s relative path above each file, so the bundle stays easy to navigate.',
    },
    sort: {
      title: 'Sort the files',
      body: 'name orders files alphabetically by file name (the default). code groups them by extension first.',
    },
    remove: {
      title: 'Drop empty lines',
      body: 'Removes blank and whitespace-only lines for a compact bundle.',
    },
    author: {
      title: 'Sign the bundle',
      body: 'Writes the author name as a comment on the first line of the output.',
    },
    rsp: {
      title: 'Save a command, run it again',
      body: 'create-rsp asks a few questions and saves the full bundle command to a .rsp file. Run it any time with mycli @name.rsp.',
    },
    notesTitle: 'Good to know',
    notes: [
      'Folders named bin, obj, Debug and Release are skipped automatically.',
      'Your source files are only read, never changed.',
      'If the output file already exists, it is replaced.',
      'Other folders, such as node_modules, are searched too — run the command in the folder you actually want bundled.',
    ],
  },
  demo: {
    title: 'Try it right here',
    lead:
      'This is a simulation that runs in your browser with a small sample project. It does not touch your computer — the installed tool works on your real folders.',
    badge: 'Browser simulation',
    modeBundle: 'bundle',
    modeRsp: 'create-rsp',
    modeLabel: 'Command',
    presetsLabel: 'Quick examples',
    presets: {
      basic: 'C# only',
      web: 'Web: JS + TS, with paths',
      everything: 'Everything, grouped by type',
      compact: 'Compact, signed',
    },
    languagesLabel: 'Languages',
    languagesHint: 'Choose at least one.',
    allLabel: 'all',
    outputLabel: 'Output file',
    outputHint: 'A file name such as bundle.txt',
    outputInvalid: 'Use letters, numbers, spaces, dots, dashes or underscores.',
    noteLabel: 'Add file path notes',
    sortLabel: 'Sort by',
    sortName: 'File name',
    sortCode: 'Extension, then name',
    removeLabel: 'Remove empty lines',
    authorLabel: 'Author',
    authorHint: 'Optional',
    rspNameLabel: 'Response file name',
    aliasesLabel: 'Use short aliases',
    run: 'Run',
    running: 'Running…',
    runAgain: 'Run again',
    commandLabel: 'Command',
    terminalLabel: 'Terminal',
    tabTerminal: 'Terminal',
    tabPreview: 'Output preview',
    tabFiles: 'Files',
    idle: 'Choose options, then press Run.',
    projectLabel: 'Sample project',
    included: 'Bundled',
    skippedExcluded: 'Skipped: build folder',
    skippedUnsupported: 'Skipped: not a supported language',
    skippedNotSelected: 'Skipped: language not selected',
    summary: '{count} of {total} files bundled',
    noFiles: 'No matching files — the output contains only the author line, if any.',
    previewEmpty: 'Run the command to see the generated file.',
    simNote: 'Simulated output. The real mycli prints only the lines shown in the terminal.',
    rspThen: 'Then run the saved command:',
    explainTitle: 'What these options do',
    explain: {
      language: 'Which files to include. all includes every supported language.',
      output: 'Where the bundle is written.',
      note: 'Adds // relative\\path above every file.',
      sort: 'Order of files inside the bundle.',
      remove: 'Strips blank lines from every file.',
      author: 'Adds // name as the first line.',
    },
  },
  install: {
    title: 'Install and run',
    lead: 'Setup takes about a minute and does not need administrator rights.',
    downloadTitle: 'BundleBloom {version} for Windows',
    downloadMeta: 'For Windows 10 and 11, 64-bit. Everything needed to run is included.',
    downloadInstaller: 'Download installer (.exe)',
    downloadZip: 'Portable ZIP',
    releaseNotes: 'Release notes',
    steps: [
      {
        title: 'Run the installer',
        body: 'BundleBloom installs for your user account and adds mycli to your PATH. Windows SmartScreen may warn about an unrecognized app because the installer is not code-signed; choose More info, then Run anyway.',
      },
      {
        title: 'Open a new terminal',
        body: 'Open a new PowerShell or Command Prompt window so it picks up the updated PATH, then check that the command is available:',
      },
      {
        title: 'Go to your project folder',
        body: 'mycli bundles the folder you are in, including all its subfolders. Move into your project first:',
      },
      {
        title: 'Create a bundle',
        body: 'Choose languages and an output file. Add any other options you need:',
      },
    ],
    moreExamples: 'More examples',
    examples: [
      { label: 'All supported languages, one file', cmd: 'mycli bundle -l all -o bundle.txt' },
      { label: 'Python and Java, grouped by type, with paths', cmd: 'mycli bundle -l Python Java -o review.txt -s code -n' },
      { label: 'Compact and signed', cmd: 'mycli bundle -l CSharp -o compact.txt -r -a "Your Team"' },
      { label: 'Save your answers as a reusable command', cmd: 'mycli create-rsp' },
      { label: 'Run a saved command', cmd: 'mycli @mybundle.rsp' },
    ],
    portableTitle: 'Using the portable ZIP',
    portableBody:
      'Extract the ZIP to a folder you keep, for example %LOCALAPPDATA%\\BundleBloom, and add that folder to your user PATH. The ZIP needs no installation.',
    troubleTitle: 'Troubleshooting',
    trouble: [
      {
        q: '“mycli is not recognized as the name of a cmdlet…”',
        a: 'Open a new terminal window after installing. If it still fails, sign out and back in, or check that the BundleBloom folder appears in your user PATH.',
      },
      {
        q: '“Option \'--language\' is required.”',
        a: 'Every bundle needs at least one language, for example -l CSharp or -l all.',
      },
      {
        q: '“Error: Please specify an output file using --output.”',
        a: 'Add -o followed by a file name, such as -o bundle.txt.',
      },
      {
        q: 'The bundle contains files I did not want',
        a: 'Run the command from a narrower folder, or choose specific languages instead of all. Only bin, obj, Debug and Release folders are skipped automatically.',
      },
      {
        q: '“Access denied” when writing the bundle',
        a: 'Choose an output location you can write to, such as your project folder or Documents.',
      },
    ],
  },
  faq: {
    title: 'Questions and answers',
    items: [
      {
        q: 'Which operating systems are supported?',
        a: 'The download is for Windows 10 and Windows 11 on 64-bit (x64) PCs. It is self-contained, so you do not need to install .NET separately.',
      },
      {
        q: 'Which languages can it bundle?',
        a: 'C# (.cs), Java (.java), Python (.py), JavaScript (.js), TypeScript (.ts), C++ (.cpp) and Go (.go). On the command line they are named CSharp, Java, Python, JavaScript, TypeScript, Cpp and Go, or all for every one of them.',
      },
      {
        q: 'How does it decide which files to include?',
        a: 'It looks at every file in the current folder and its subfolders, skipping anything inside folders named bin, obj, Debug or Release. A file is included when its extension belongs to one of the languages you chose. The output file is never bundled into itself.',
      },
      {
        q: 'Does BundleBloom change my source files?',
        a: 'No. It only reads them. The single file it writes is the output you name — and if that file already exists, it is replaced.',
      },
      {
        q: 'How do I make mycli available in every terminal?',
        a: 'The installer adds its folder to your user PATH automatically. Open a new terminal afterwards. If you use the portable ZIP, add the extracted folder to your PATH yourself.',
      },
      {
        q: 'What is a response file?',
        a: 'A .rsp file stores a complete bundle command, one argument per line. mycli create-rsp builds one by asking a few questions; mycli @name.rsp runs it.',
      },
      {
        q: 'How is the online demo different from the real tool?',
        a: 'The demo is a simulation in your browser using a built-in sample project. It cannot see or read your files. The installed mycli runs on your computer and works with your real project folders.',
      },
      {
        q: 'Do I need administrator rights?',
        a: 'No. The installer installs for your user account only. You can remove BundleBloom at any time from Settings › Apps.',
      },
    ],
  },
  footer: {
    tagline: 'One project. One file.',
    links: 'Links',
    source: 'GitHub',
    releases: 'Releases',
    note: 'BundleBloom is free software for Windows. The command it installs is mycli.',
  },
  floating: {
    label: 'Download BundleBloom for Windows',
    short: 'Download',
  },
};

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : { [K in keyof T]: Widen<T[K]> };

export type Dict = Widen<typeof en>;
