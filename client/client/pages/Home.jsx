import { Link } from 'react-router-dom';
import { 
  HardDriveIcon,
  ImageIcon,
  VideoIcon,
  Music as AudioIcon,
  FileTextIcon,
  ClockIcon,
} from 'lucide-react';
import MediaCard from '../components/MediaCard';
import { PageHeader } from '../components/ui/PageHeader';
import { stats as statsApi, media } from '../../lib/api';
import { useEffect, useState } from 'react';

export default function Home() {
  const [stats, setStats] = useState(null);
  const [recentFiles, setRecentFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, recentData] = await Promise.all([
          statsApi.getDashboard(),
          statsApi.getRecent(5),
        ]);
        setStats(statsData);
        setRecentFiles(recentData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const categoryStats = [
    { name: 'Videos', count: stats?.byType?.videos || 0, icon: VideoIcon, href: '/videos', color: 'text-red-400' },
    { name: 'Images', count: stats?.byType?.images || 0, icon: ImageIcon, href: '/images', color: 'text-green-400' },
    { name: 'Audio', count: stats?.byType?.audios || 0, icon: AudioIcon, href: '/audio', color: 'text-purple-400' },
    { name: 'Documents', count: stats?.byType?.documents || 0, icon: FileTextIcon, href: '/documents', color: 'text-blue-400' },
  ];

  return (
    <div className="h-full overflow-auto">
      <PageHeader
        title="Dashboard"
        description="Overview of your media library"
      />

      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                <HardDriveIcon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats?.totalSizeFormatted || '0 B'}
                </p>
                <p className="text-sm text-muted-foreground">Total Storage</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                <FileTextIcon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats?.totalFiles || 0}
                </p>
                <p className="text-sm text-muted-foreground">Total Files</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats?.user?.watchHistoryCount || 0}
                </p>
                <p className="text-sm text-muted-foreground">Watch History</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categoryStats.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  to={category.href}
                  className="card p-4 hover:border-accent transition-colors"
                >
                  <Icon className={`w-6 h-6 ${category.color} mb-2`} />
                  <p className="text-lg font-semibold text-foreground">{category.count}</p>
                  <p className="text-sm text-muted-foreground">{category.name}</p>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <ClockIcon className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Recent Files</h2>
          </div>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : recentFiles.length > 0 ? (
            <div className="space-y-2">
              {recentFiles.map((file) => (
                <MediaCard
                  key={file.id}
                  name={file.name}
                  type={file.fileType}
                  size={file.sizeFormatted}
                  duration={file.durationFormatted}
                  onClick={() => console.log('Open', file.name)}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No recent files</p>
          )}
        </div>
      </div>
    </div>
  );
}
