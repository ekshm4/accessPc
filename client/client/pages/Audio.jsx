import { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, RefreshCw } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { LoadingScreen } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { media, stream } from '../../lib/api';

export default function Audio() {
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const fetchAudios = async () => {
    setLoading(true);
    try {
      const data = await media.getAudios();
      setAudios(data);
    } catch (error) {
      console.error('Failed to fetch audios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudios();
  }, []);

  const handleAudioClick = (audio) => {
    setCurrentAudio(audio);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const closePlayer = () => {
    setCurrentAudio(null);
    setIsPlaying(false);
  };

  if (loading) {
    return (
      <div className="h-full">
        <PageHeader
          icon={Music}
          title="Audio"
          breadcrumbs={['Audio']}
        />
        <div className="flex items-center justify-center h-[calc(100%-60px)]">
          <LoadingScreen text="Loading audio..." />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <PageHeader
        icon={Music}
        title="Audio"
        breadcrumbs={['Audio']}
        action={
          <Button size="sm" onClick={fetchAudios}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        }
      />

      <div className="p-6 pb-32">
        {audios.length > 0 ? (
          <div className="space-y-2">
            {audios.map((audio) => (
              <div
                key={audio.id}
                onClick={() => handleAudioClick(audio)}
                className={`flex items-center gap-4 p-4 bg-card border rounded-lg cursor-pointer transition-colors ${
                  currentAudio?.id === audio.id
                    ? 'border-accent bg-accent/10'
                    : 'border-border hover:border-accent'
                }`}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <Music className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{audio.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{audio.sizeFormatted}</span>
                    {audio.durationFormatted && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{audio.durationFormatted}</span>
                      </>
                    )}
                  </div>
                </div>
                {currentAudio?.id === audio.id && isPlaying ? (
                  <Pause className="w-5 h-5 text-accent" />
                ) : (
                  <Play className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No audio files found</p>
            <p className="text-sm text-muted-foreground">
              Click "Scan" in the Folders page to scan your media library
            </p>
          </div>
        )}
      </div>

      {currentAudio && (
        <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t border-border">
          <div className="flex items-center gap-4 p-4">
            <div className="flex-shrink-0">
              <Music className="w-8 h-8 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{currentAudio.name}</p>
              <p className="text-xs text-muted-foreground">{currentAudio.sizeFormatted}</p>
            </div>
            <button
              onClick={togglePlay}
              className="p-3 bg-accent rounded-full hover:bg-accent/90 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white ml-0.5" />
              )}
            </button>
            <button
              onClick={closePlayer}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <span className="text-xl text-muted-foreground">×</span>
            </button>
          </div>
          <audio
            ref={audioRef}
            autoPlay={isPlaying}
            src={stream.getAudioUrl(currentAudio.name)}
            className="w-full h-1 accent-accent"
            onEnded={() => setIsPlaying(false)}
          />
        </div>
      )}
    </div>
  );
}
