import { FileIcon, VideoIcon, ImageIcon, Music as AudioIcon, FileTextIcon, Folder as FolderIcon } from 'lucide-react';

const typeIcons = {
  video: VideoIcon,
  audio: AudioIcon,
  image: ImageIcon,
  document: FileTextIcon,
  file: FileIcon,
  folder: FolderIcon,
};

export default function MediaCard({ 
  name, 
  type, 
  size, 
  duration, 
  thumbnail, 
  onClick,
  className = '',
}) {
  const Icon = typeIcons[type] || FileIcon;

  return (
    <div
      className={`group bg-card border border-border rounded-lg p-4 hover:bg-muted hover:border-accent transition-colors cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
          {thumbnail ? (
            <img 
              src={thumbnail} 
              alt={name} 
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <Icon className="w-5 h-5 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-foreground truncate group-hover:text-white">
            {name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {size && (
              <span className="text-xs text-muted-foreground">
                {size}
              </span>
            )}
            {duration && (
              <>
                {size && <span className="text-xs text-muted-foreground">•</span>}
                <span className="text-xs text-muted-foreground">
                  {duration}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
