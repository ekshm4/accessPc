import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  FolderIcon,
  FileText,
  Music,
  VideoIcon,
} from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Browse', href: '/folders', icon: FolderIcon },
  { name: 'Docs', href: '/documents', icon: FileText },
  { name: 'Audio', href: '/audio', icon: Music },
  { name: 'Videos', href: '/videos', icon: VideoIcon },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border lg:hidden">
      <ul className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <li key={item.name}>
              <Link
                to={item.href}
                className={`
                  flex flex-col items-center gap-1 px-4 py-3
                  text-xs font-medium transition-colors
                  ${isActive
                    ? 'text-accent'
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
