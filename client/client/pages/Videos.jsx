import { FolderIcon, VideoIcon } from "lucide-react";
import { useState, useEffect } from "react";
import MediaCard from "../components/MediaCard";
import Play from "./playing.jsx";
import {useNavigate} from 'react-router-dom';

const {VITE_URL, VITE_PORT} = import.meta.env;


export default function Videos() {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${VITE_URL}/show/videos`);
        console.log(response);
        const jsonData = await response.json();
        setData(jsonData);
        console.log(jsonData);
      } catch (e) {
        console.log("response")
        console.error("failed to fetch data", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center text-sm justify-center align-center text-gray-100">loading ...</div>
    )
  }

  return (
    <div className="h-full overflow-auto">
      {/* header */}
      <div className="border-b border-gray-700 bg-gray-900/95 backdrop-blur">
        <div className="flex items-center gap-2 px-6 py-4">
          <FolderIcon className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-400">/</span>
          <div className="flex items-center gap-2">
            <VideoIcon className="w-5 h-5 text-gray-100" />
            <span className="text-sm font-medium text-gray-100">videos</span>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="p-6">
        <div className="space-y-2">
          {data.map((video) => (
            <MediaCard
              key={video.id}
              name={video.name}
              type={video.fileType}
              size={video.size}
              duration={video.duration}
              onClick={() => {
                localStorage.setItem("playing", video.name);
                navigate("/playing",{
                  state: {
                    filename: video.name,
                    mimetype: video.mimetype,
                  },
                });
              }}
            />
          ))}
        </div>
      </div>

      {/* video player */}
      {selectedVideo && (
        <Play filename={selectedVideo.name} mimetype={selectedVideo.mimetype} />
      )}
    </div>
  );
}



