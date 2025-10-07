import { FileIcon, VideoIcon, ImageIcon, Music as AudioIcon, FileTextIcon } from "lucide-react";

const typeIcons = {
  video: VideoIcon,
  audio: AudioIcon,
  image: ImageIcon,
  document: FileTextIcon,
  file: FileIcon,
};

export default function MediaCard({ 
  name, 
  type, 
  size, 
  duration, 
  thumbnail, 
  onClick 
}) {
  const Icon = typeIcons[type];

  return (
    <div
      className="group bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {/* Icon or thumbnail */}
        <div className="flex-shrink-0 w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
          {thumbnail ? (
            <img 
              src={thumbnail} 
              alt={name} 
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <Icon className="w-5 h-5 text-gray-400" />
          )}
        </div>

        {/* File info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-100 truncate group-hover:text-white">
            {name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {size && (
              <span className="text-xs text-gray-400">
                {size}
              </span>
            )}
            {duration && (
              <>
                {size && <span className="text-xs text-gray-400">•</span>}
                <span className="text-xs text-gray-400">
                  {duration}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Type indicator for videos */}
        {type === "video" && (
          <div className="flex-shrink-0">
            <VideoIcon className="w-4 h-4 text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
}
