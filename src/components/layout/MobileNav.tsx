import { Link, useLocation } from 'react-router-dom';
import { Home, Swords, Target, Database, BarChart2, Hammer, Settings } from 'lucide-react';

const mobileLinks = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Builder', path: '/builder', icon: Hammer },
  { name: 'Advisor', path: '/advisor', icon: Target },
  { name: 'Battle', path: '/battle', icon: Swords },
  { name: 'DB', path: '/database', icon: Database },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/90 backdrop-blur-sm overflow-x-auto">
      <div className="flex justify-start min-w-max px-2 sm:justify-around items-center h-16 gap-4 sm:gap-0">
        {mobileLinks.map(link => {
          const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                isActive ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
