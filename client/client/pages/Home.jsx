import { Link } from "react-router-dom";
import { 
  FolderIcon, 
  FileIcon, 
  ImageIcon, 
  VolumeXIcon as AudioIcon, 
  VideoIcon,
  FileTextIcon,
  TrendingUpIcon,
  ClockIcon,
  HardDriveIcon
} from "lucide-react";
import MediaCard from "../components/MediaCard";
import { useEffect} from "react";

const quickStats = [
  { label: "Total Files", value: "2,847", icon: FileIcon },
  { label: "Storage Used", value: "89.2 GB", icon: HardDriveIcon },
  { label: "Recent Activity", value: "156", icon: TrendingUpIcon },
];

const categoryStats = [
  { name: "Videos", count: 324, size: "45.2 GB", icon: VideoIcon, href: "/videos" },
  { name: "Images", count: 1203, size: "12.8 GB", icon: ImageIcon, href: "/images" },
  { name: "Audio", count: 892, size: "23.1 GB", icon: AudioIcon, href: "/audio" },
  { name: "Documents", count: 428, size: "8.1 GB", icon: FileTextIcon, href: "/documents" },
];

const recentFiles = [
  {
    id: 1,
    name: "Summer_Vacation_2024.mp4",
    type: "video",
    size: "2.1 GB",
    duration: "12:34",
  },
  {
    id: 2,
    name: "Project_Presentation.pptx",
    type: "document",
    size: "45 MB",
  },
  {
    id: 3,
    name: "Sunrise_Beach.jpg",
    type: "image",
    size: "8.2 MB",
  },
  {
    id: 4,
    name: "Podcast_Episode_15.mp3",
    type: "audio",
    size: "89 MB",
    duration: "52:18",
  },
];

const { VITE_URL }  = import.meta.env;

export default function Home() {
  

  useEffect(() => {
    fetch(`${VITE_URL}/`)
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error("Error fetching data:", err));
  }, []);
    

  return (
    <div className="h-full overflow-auto">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-900/95 backdrop-blur">
        <div className="px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-100">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">
            Overview of your media library
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Categories Overview */}
        <div>
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryStats.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  to={category.href}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-700 hover:border-gray-600 transition-colors group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="w-6 h-6 text-blue-400" />
                    <h3 className="font-medium text-gray-100 group-hover:text-white">
                      {category.name}
                    </h3>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400">
                      {category.count} files
                    </p>
                    <p className="text-sm text-gray-400">
                      {category.size}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Files */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ClockIcon className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-100">Recent Files</h2>
          </div>
          <div className="space-y-2">
            {recentFiles.map((file) => (
              <MediaCard
                key={file.id}
                name={file.name}
                type={file.type}
                size={file.size}
                duration={file.duration}
                onClick={() => {
                  console.log(`Opening ${file.name}`);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
