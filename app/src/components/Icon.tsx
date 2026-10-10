interface IconProps {
  name: 'arrow' | 'arrowLeft' | 'check' | 'close' | 'document' | 'grid' | 'history' | 'home' | 'info' | 'layers' | 'memory' | 'menu' | 'path' | 'search' | 'settings' | 'test'
  size?: number
}

const paths: Record<IconProps['name'], React.ReactNode> = {
  arrow: <path d="m9 5 7 7-7 7" />,
  arrowLeft: <path d="m15 5-7 7 7 7" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  close: <path d="m7 7 10 10M17 7 7 17" />,
  document: <><path d="M6 3.5h8l4 4V20H6z" /><path d="M14 3.5V8h4M9 12h6M9 16h6" /></>,
  grid: <><rect x="4" y="4" width="6.5" height="6.5" rx="1.2" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2" /></>,
  history: <><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" /><path d="M4.5 5.5v5h5M12 8v4l3 2" /></>,
  home: <><path d="m4 11 8-6.5L20 11" /><path d="M6.5 10.5V19h11v-8.5" /></>,
  info: <><circle cx="12" cy="12" r="8" /><path d="M12 11v5M12 8h.01" /></>,
  layers: <><path d="m4 8 8-4 8 4-8 4z" /><path d="m4 12 8 4 8-4M4 16l8 4 8-4" /></>,
  memory: <><rect x="5" y="5" width="14" height="14" rx="3" /><path d="M9 2.5v3M15 2.5v3M9 18.5v3M15 18.5v3M2.5 9h3M18.5 9h3M2.5 15h3M18.5 15h3M9 10h6M9 14h4" /></>,
  menu: <path d="M5 7h14M5 12h14M5 17h14" />,
  path: <><circle cx="6" cy="6" r="2" /><circle cx="18" cy="18" r="2" /><path d="M8 6h3a3 3 0 0 1 3 3v6a3 3 0 0 0 3 3" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6" /><path d="m15 15 5 5" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" /></>,
  test: <><path d="M9 3h6M10 3v5l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3" /><path d="M8 15h8" /></>
}

export function Icon({ name, size = 18 }: IconProps) {
  return <svg aria-hidden="true" className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}
