const PATHS = {
  copy: 'M9 9h10v10H9zM5 15V5h10',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  globe: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3.5 9h17M3.5 15h17M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z',
  download: 'M12 4v11M7 10.5l5 5 5-5M5 19.5h14',
  play: 'M8 5.5v13l10.5-6.5z',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  chevron: 'M8 10l4 4 4-4',
  github:
    'M12 3a9 9 0 00-2.85 17.54c.45.08.62-.2.62-.43v-1.6c-2.5.54-3.03-1.07-3.03-1.07-.41-1.04-1-1.32-1-1.32-.82-.56.06-.55.06-.55.9.06 1.38.93 1.38.93.8 1.38 2.11.98 2.62.75.08-.58.31-.98.57-1.2-2-.23-4.1-1-4.1-4.45 0-.98.35-1.79.93-2.42-.1-.23-.4-1.14.08-2.38 0 0 .76-.24 2.48.93a8.6 8.6 0 014.5 0c1.72-1.17 2.48-.93 2.48-.93.49 1.24.18 2.15.09 2.38.58.63.92 1.44.92 2.42 0 3.46-2.1 4.22-4.11 4.44.32.28.61.83.61 1.67v2.48c0 .24.16.52.62.43A9 9 0 0012 3z',
  windows: 'M4 5.5l7-1v7H4zM12 4.4l8-1.2v8.3h-8zM4 12.5h7v7l-7-1zM12 12.5h8v8.3l-8-1.2z',
  file: 'M7 3.5h7l4 4v13H7zM14 3.5v4h4',
} as const;

export type IconName = keyof typeof PATHS;

const FILLED: IconName[] = ['play', 'github', 'windows'];

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const filled = FILLED.includes(name);
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
