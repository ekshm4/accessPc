import { VolumeXIcon as AudioIcon, FolderIcon } from "lucide-react";
import MediaCard from "../components/MediaCard.jsx";
import {useState, useEffect, useRef} from "react";
import { X } from "lucide-react";
const {VITE_URL, VITE_PORT} = import.meta.env;

export default function Audio() {
  const [isClosed, setClosedClicked] = useState(false); 
  const [audioData, setAudioData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(localStorage.getItem("audioPlaying") || null);
  const audioRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${VITE_URL}/show/audios`);
        const jsonData = await response.json();
        console.log(jsonData);
        setAudioData(jsonData);
      } catch (e) {
        console.error("err occured can't fetch data", e);
      } finally {
        setIsLoading(false);
      }
            
    })();
  },[]);
  

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.warn("Autoplay blocked", err);
      });
    }
  },[audioPlaying]);
  

  if (isLoading) {
    return (
      <div className="align-center justify-center text-sm">loading ...</div>
    )
  }

  const toggleMediaPlayer = () => {
    setClosedClicked(!isClosed);
  }
  
  return (
    <div className="h-full overflow-auto">
      
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2 px-6 py-4">
          <FolderIcon className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">/</span>
          <div className="flex items-center gap-2">
            <AudioIcon className="w-5 h-5 text-foreground" />
            <span className="text-sm font-medium text-foreground">Audio</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-2">
          {audioData.map((audio) => (
            <MediaCard
              key={audio.id}
              name={audio.name}
              type={audio.fileType}
              size={audio.size}
              duration={audio.duration}
              onClick={() => {
                localStorage.setItem("audioPlaying",audio.name);
                setAudioPlaying(audio.name);
                setClosedClicked(false);
              }}
            />
          ))}
        </div>
      </div>

      {/* hovering div */}

      {audioPlaying && (
        <div className={`${isClosed ? 'invisible': 'visible' } fixed bottom-10 rounded-[50px] gap-3 left-[200px] right-[200px] z-50 backdrop-blur-md bg-black/30 border-t border-white/10 shadow-xl  px-4 py-2 flex items-center justify-between`}>
          <div className="text-white text-sm px-2 font-medium">
            Now Playing: {audioPlaying}
          </div>
          <audio controls ref={audioRef}  key={audioPlaying} className="w-[700px] ">
            <source src={`${VITE_URL}/stream/audio/${encodeURIComponent(audioPlaying)}`} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors" onClick={toggleMediaPlayer}>
            <X className="w-5 h-5 text-gray-300" />
          </button>

        </div>         
      )}
 
    
    </div>
  );
}
