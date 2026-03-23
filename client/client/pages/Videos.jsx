import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoIcon, Play, RefreshCw } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { LoadingScreen } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { media } from '../../lib/api';

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const data = await media.getVideos();
      setVideos(data);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleVideoClick = (video) => {
    localStorage.setItem('playing', JSON.stringify({
      filename: video.name,
      mimetype: video.mimeType,
      id: video.id,
    }));
    navigate('/playing');
  };

  if (loading) {
    return (
      <div className="h-full">
        <PageHeader
          icon={VideoIcon}
          title="Videos"
          breadcrumbs={['Videos']}
        />
        <div className="flex items-center justify-center h-[calc(100%-60px)]">
          <LoadingScreen text="Loading videos..." />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <PageHeader
        icon={VideoIcon}
        title="Videos"
        breadcrumbs={['Videos']}
        action={
          <Button size="sm" onClick={fetchVideos}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        }
      />

      <div className="p-6">
        {videos.length > 0 ? (
          <div className="space-y-2">
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => handleVideoClick(video)}
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-accent cursor-pointer transition-colors group"
              >
                <div className="flex-shrink-0 w-16 h-12 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                  <VideoIcon className="w-6 h-6 text-muted-foreground" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-white">
                    {video.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{video.sizeFormatted}</span>
                    {video.durationFormatted && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{video.durationFormatted}</span>
                      </>
                    )}
                  </div>
                </div>
                <Play className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <VideoIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No videos found</p>
            <p className="text-sm text-muted-foreground">
              Click "Scan" in the Folders page to scan your media library
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
