import { Link, useLocation } from 'react-router-dom';
import { Swords } from 'lucide-react';
import { SearchBar } from '../SearchBar';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Builder', path: '/builder' },
  { name: 'Advisor', path: '/advisor' },
  { name: 'Battle', path: '/battle' },
  { name: 'Database', path: '/database' },
  { name: 'Type Chart', path: '/typechart' },
  { name: 'Settings', path: '/settings' },
];

export function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm hidden md:block">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white text-xs font-black shadow">
            <Swords size={14} />
          </div>
          <span className="font-bold tracking-tight">Champions<span className="text-red-500">Advisor</span></span>
        </Link>
        <nav className="flex items-center gap-1">
          {navLinks.map(link => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
