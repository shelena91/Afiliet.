import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/', label: 'Painel', icon: HomeIcon },
  { to: '/produtos', label: 'Produtos', icon: BoxIcon },
  { to: '/links', label: 'Links', icon: LinkIcon },
  { to: '/comissoes', label: 'Comissões', icon: CoinIcon },
  { to: '/calendario', label: 'Agenda', icon: CalendarIcon },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-ink/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-md justify-between px-2">
        {TABS.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2.5 text-[11px] font-body transition-colors ${
                  isActive ? 'text-flow' : 'text-muted'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative">
                    <Icon active={isActive} />
                    {isActive && (
                      <span className="absolute -top-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-thread" />
                    )}
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 1.8}>
      <path d="M4 11.5 12 4l8 7.5M6 10v9h12v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function BoxIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 1.8}>
      <path d="M3.5 7.5 12 3l8.5 4.5L12 12 3.5 7.5Z" strokeLinejoin="round" />
      <path d="M3.5 7.5V16l8.5 4.5V12M20.5 7.5V16L12 20.5" strokeLinejoin="round" />
    </svg>
  );
}
function LinkIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 1.8}>
      <path d="M9.5 14.5 14.5 9.5" strokeLinecap="round" />
      <path d="M11 6.5 13 4.6a3.6 3.6 0 0 1 5.1 5.1L16.2 11.6M13 17.5l-1.9 1.9a3.6 3.6 0 0 1-5.1-5.1l1.9-1.9" strokeLinecap="round" />
    </svg>
  );
}
function CoinIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 1.8}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8M9.5 10a2.2 2.2 0 0 1 2.2-1.7h.6A2.1 2.1 0 0 1 12 12.4a2.1 2.1 0 0 1 0 4.1h-.6A2.2 2.2 0 0 1 9.2 14.8" strokeLinecap="round" />
    </svg>
  );
}
function CalendarIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 1.8}>
      <rect x="4" y="5.5" width="16" height="14.5" rx="2" />
      <path d="M4 10h16M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}
