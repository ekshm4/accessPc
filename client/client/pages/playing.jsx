import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoIcon, ArrowLeft } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { stream } from '../../lib/api';

export default function Play() {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('playing');
    if (!saved) {
      navigate('/');
    }
  }, [navigate]);

  const getVideoInfo = () => {
    const saved = localStorage.getItem('playing');
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return { filename: saved, mimetype: 'video/mp4' };
    }
  };

  const video = getVideoInfo();

  if (!video) {
    return null;
  }

  return (
    <div className="h-full overflow-auto">
      <PageHeader
        icon={VideoIcon}
        title="Now Playing"
        breadcrumbs={['Videos', video.filename]}
      />

      <div className="p-6">
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        <video
          ref={videoRef}
          controls
          autoPlay
          preload="metadata"
          className="w-full max-w-5xl mx-auto rounded-lg"
          src={stream.getVideoUrl(video.filename)}
        >
          Your browser does not support the video tag.
        </video>

        <div className="mt-4 text-center">
          <p className="text-lg font-medium text-foreground">{video.filename}</p>
        </div>
      </div>
    </div>
  );
}
