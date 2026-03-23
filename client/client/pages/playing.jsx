import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoIcon, ArrowLeft, SkipBack, SkipForward } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { stream, media } from '../../lib/api';

export default function Play() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('playing');
    if (!saved) {
      navigate('/');
      return;
    }

    media.getVideos().then(data => {
      setVideos(data);
      const videoInfo = JSON.parse(saved);
      const index = data.findIndex(v => v.name === videoInfo.filename);
      setCurrentIndex(index >= 0 ? index : 0);
    });
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

  const playVideo = (video) => {
    localStorage.setItem('playing', JSON.stringify({
      filename: video.name,
      mimetype: video.mimeType,
      id: video.id,
    }));
    window.location.reload();
  };

  const playNext = () => {
    if (videos.length === 0) return;
    const nextIndex = (currentIndex + 1) % videos.length;
    playVideo(videos[nextIndex]);
  };

  const playPrevious = () => {
    if (videos.length === 0) return;
    const prevIndex = currentIndex === 0 ? videos.length - 1 : currentIndex - 1;
    playVideo(videos[prevIndex]);
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
        <div className="mb-4 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={playPrevious}
            className="gap-2"
          >
            <SkipBack className="w-4 h-4" />
            Previous
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={playNext}
            className="gap-2"
          >
            Next
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        <video
          ref={videoRef}
          controls
          autoPlay
          preload="metadata"
          className="w-full max-w-5xl mx-auto rounded-lg"
          src={stream.getVideoUrl(video.filename)}
          onEnded={playNext}
        >
          Your browser does not support the video tag.
        </video>

        <div className="mt-4 text-center">
          <p className="text-lg font-medium text-foreground">{video.filename}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {currentIndex + 1} of {videos.length}
          </p>
        </div>
      </div>
    </div>
  );
}
