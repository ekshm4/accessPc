import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  FolderIcon,
  FileIcon,
  ImageIcon,
  VolumeXIcon as AudioIcon,
  VideoIcon,
  SettingsIcon,
  HomeIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  MenuIcon,
  FileText,
} from 'lucide-react';

const navigationItems = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Folders', href: '/folders', icon: FolderIcon },
  { name: 'Files', href: '/files', icon: FileIcon },
  { name: 'Images', href: '/images', icon: ImageIcon },
  { name: 'Audio', href: '/audio', icon: AudioIcon },
  { name: 'Videos', href: '/videos', icon: VideoIcon },
  { name: 'Documents', href: '/documents', icon: FileText },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:relative z-50 lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isMinimized ? 'w-16' : 'w-64'}
          h-screen bg-background border-r border-border 
          flex flex-col transition-all duration-300
        `}
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={toggleMinimize}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title={isMinimized ? 'Expand sidebar' : 'Minimize sidebar'}
            >
              {isMinimized ? (
                <PanelLeftOpenIcon className="w-5 h-5 text-muted-foreground" />
              ) : (
                <PanelLeftCloseIcon className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {!isMinimized && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors lg:hidden"
              >
                <MenuIcon className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        <nav className="flex-1 p-2 overflow-y-auto scrollbar-hide">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={onClose}
                    className={`
                      flex items-center
                      ${isMinimized ? 'justify-center' : 'gap-3'}
                      px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }
                    `}
                    title={isMinimized ? item.name : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isMinimized && (
                      <span className="truncate">{item.name}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-2 border-t border-border">
          <Link
            to="/settings"
            onClick={onClose}
            className={`
              flex items-center
              ${isMinimized ? 'justify-center' : 'gap-3'}
              px-3 py-2 rounded-lg text-sm font-medium
              text-muted-foreground hover:bg-muted hover:text-foreground
              transition-colors
            `}
            title={isMinimized ? 'Settings' : undefined}
          >
            <SettingsIcon className="w-5 h-5 flex-shrink-0" />
            {!isMinimized && <span className="truncate">Settings</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
