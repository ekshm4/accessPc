import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  FolderIcon,
  FileIcon,
  ImageIcon,
  VolumeXIcon as AudioIcon,
  VideoIcon,
  FileTextIcon,
  DownloadIcon,
  UserIcon,
  SettingsIcon,
  HomeIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  MonitorPlay
} from "lucide-react";

const navigationItems = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Folders", href: "/folders", icon: FolderIcon },
  { name: "Files", href: "/files", icon: FileIcon },
  { name: "Images", href: "/images", icon: ImageIcon },
  { name: "Audio", href: "/audio", icon: AudioIcon },
  { name: "Videos", href: "/videos", icon: VideoIcon },
  { name: "Playing", href: "/playing", icon: MonitorPlay }
];

const recentItems = [
  { name: "Project Presentation", href: "/documents/presentation" },
  { name: "Summer Vacation", href: "/images/summer" },
  { name: "Meeting Recording", href: "/videos/meeting" },
  { name: "Podcast Episode", href: "/audio/podcast" },
  { name: "Design Files", href: "/folders/design" },
];

export default function Sidebar() {
  const location = useLocation();
  const [isMinimized, setIsMinimized] = useState(true);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`${isMinimized ? 'w-16' : 'w-64'} bg-gray-950 border-r  border-gray-800 flex flex-col transition-all duration-300`}>
      {/* Top section with minimize, download and user icons */}
      <div className="p-4 border-b  border-gray-800">
        <div className="flex items-center justify-between gap-3">
          {/* Minimize button */}
          <button
            onClick={toggleMinimize}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            title={isMinimized ? "Expand sidebar" : "Minimize sidebar"}
          >
            {isMinimized ? (
              <PanelLeftOpenIcon className="w-5 h-5 text-gray-300" />
            ) : (
              <PanelLeftCloseIcon className="w-5 h-5 text-gray-300" />
            )}
          </button>

          {/* Download and user icons - hidden when minimized */}
          {!isMinimized && (
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <DownloadIcon className="w-5 h-5 text-gray-300" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <UserIcon className="w-5 h-5 text-gray-300" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center ${isMinimized ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                  title={isMinimized ? item.name : undefined}
                >
                  <Icon className="w-5 h-5" />
                  {!isMinimized && (
                    <span className="transition-opacity duration-300">
                      {item.name}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Recent section - hidden when minimized */}
        {!isMinimized && (
          <div className="mt-8">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Recent
            </h3>
            <ul className="space-y-1">
              {recentItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors truncate"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Bottom settings */}
      <div className="p-2 border-t border-gray-800">
        <Link
          to="/settings"
          className={`flex items-center ${isMinimized ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors`}
          title={isMinimized ? "Settings" : undefined}
        >
          <SettingsIcon className="w-5 h-5" />
          {!isMinimized && (
            <span className="transition-opacity duration-300">
              Settings
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}

