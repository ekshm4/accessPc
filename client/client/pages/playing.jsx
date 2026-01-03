import { FolderIcon, VideoIcon } from "lucide-react";
import React,{ useState , useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const { VITE_URL,VITE_PORT } = import.meta.env;

export default function Play() {
  const location = useLocation();
  const navigate = useNavigate();

  const { filename, mimetype } = location.state || {};
  console.log("location state", location.state);
  const watching = localStorage.getItem("playing");
  

  //if (!filename || !mimetype) {
  //  return (
  //    <div className="p-6 text-red-500">
  //      No video selected. <button onClick={() => navigate("/")}>Go back</button>
  //    </div>
  //  );
 // }

  const [videoSrc, setVideoSrc] = useState("");

  useEffect(() => {
    if (!watching) return;

    const fetchVideo = async () => {
      try {
        const res = await fetch(
          `${VITE_URL}/stream/video/${encodeURIComponent(watching)}`,
          {
            headers: {
              "ngrok-skip-browser-warning": "true", // 👈 important header
            },
          }
        );

        const blob = await res.blob();             // Get video as blob
        const url = URL.createObjectURL(blob);     // Create a temporary URL
        setVideoSrc(url);
      } catch (err) {
        console.error("Video fetch error:", err);
      }
    };

    fetchVideo();
  }, [watching]);


  return (
    <div className="h-full overflow-auto">
      {/* header */}
      <div className="border-b border-gray-700 bg-gray-900/95 backdrop-blur">
        <div className="flex items-center gap-2 px-6 py-4">
          <FolderIcon className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-400">/</span>
           <div className="flex items-center gap-2">
            <VideoIcon className="w-5 h-5 text-gray-100" />
            <span className="text-sm font-medium text-gray-100">playing</span>
            <p className="text-sm text-gray-400">{filename}</p>
          </div>
        </div>
      </div>

      {/* video content */}
      <div className="p-6">

        <video controls className="w-full max-w-4xl mx-auto" src={videoSrc}>
          Your browser does not support the video tag.
        </video>   

      </div>
    </div>
  );
}

