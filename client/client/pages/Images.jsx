import { ImageIcon, FolderIcon, X } from "lucide-react";
import MediaCard from "../components/MediaCard";
import { useState ,useEffect,useRef } from "react";
const {VITE_URL, VITE_PORT} = import.meta.env;


export default function Images() {
  const [isClosed, setClosedClicked] = useState(true);
  const [data,setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(localStorage.getItem("selectedImage") || null);
  const imageRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${VITE_URL}/show/images/`);
        const jsonData = await response.json();
        setData(jsonData);
        console.log(jsonData);
      } catch (e) {
        console.error("an error occured", e);
      } finally {
        setIsLoading(false);
      }
    })();
  },[]);


  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.play().catch(err => {
        console.warn("failed to load", err);
      });
    }
  },[selectedImage]);
  

  if (isLoading) {
    return (
      <div className="flex items-center text-sm justify-center align-center text-gray-100">loading ...</div>
    )
  }

  const toggleMediaImg = () => {
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
            <ImageIcon className="w-5 h-5 text-foreground" />
            <span className="text-sm font-medium text-foreground">Images</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-2">
          {data.map((image) => (
            <MediaCard
              key={image.id}
              name={image.name}
              type={image.fileType}
              size={image.size}
              onClick={() => {
                localStorage.setItem("selectedImage",image.name);
                setSelectedImage(image.name);
                setClosedClicked(false);
              }}
            />
          ))}
        </div>
      </div>

      {/*overlapping div*/}
    {selectedImage && (
      <div className={`${isClosed ? 'invisible': 'visible'} absolute bottom-0 left-[50%] transform -translate-x-[50%] z-50 backdrop-blur-md bg-black/30 border-t border-white/10 shadow-xl px-4 py-4 flex flex-col items-center justify-between gap-4 h-[100vh] w-[90%]`}>
        <div className="text-white text-sm px-2 font-medium">
          Image name: {selectedImage}
        </div>
        <div className="w-[50%] h-[100vh] overflow-hidden rounded-lg">
          <img
            src={`${VITE_URL}/stream/images/${encodeURIComponent(selectedImage)}`}
            alt="image"
            className="object-cover w-full h-full"
          />
        </div>
        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors" onClick={toggleMediaImg}>
          <X className="w-5 h-5 text-gray-300" />
        </button>
        
      
      </div>
    )}
            
            
    </div>
  );
}
