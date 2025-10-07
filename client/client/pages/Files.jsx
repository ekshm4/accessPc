import { FileIcon, FolderIcon, X } from "lucide-react";
import { useEffect, useState, useRef } from 'react';
import MediaCard from '../components/MediaCard';
const {VITE_URL} = import.meta.env;

export default function Files() {
  const [data, setData] = useState([]);
  const [isClosed, setIsClosed] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(localStorage.getItem("selectedDoc") || null);
  const [isLoadingDisplay, setIsLoadingDisplay] = useState(true);
  const [displayFile, setDisplayFile] = useState(null);

  // Fetch list of documents on mount
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${VITE_URL}/show/documents`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const jsonData = await response.json();
        setData(jsonData);
        console.log("Documents list:", jsonData);
      } catch (e) {
        console.error("Failed to fetch documents list", e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Fetch the content of selected document
  const fetchResults = async (selectedDocument) => {
    setIsLoadingDisplay(true);
    try {
      const response = await fetch(`${VITE_URL}/stream/documents/${encodeURIComponent(selectedDocument)}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const jsonData = await response.json();
      setDisplayFile(jsonData);
    } catch (e) {
      console.error("Failed to get display data", e);
      setDisplayFile(null);
    } finally {
      setIsLoadingDisplay(false);
    }
  };

  // On mount, if there's a saved selectedDoc, fetch its content
  useEffect(() => {
    if (selectedDoc) {
      fetchResults(selectedDoc);
      setIsClosed(false); // Show display panel if there is a saved doc
    }
  }, []);

  // Toggle display panel visibility
  const toggleMediaDoc = () => {
    setIsClosed(!isClosed);
  };

  if (isLoading) {
    return (
      <div className="text-sm flex items-center justify-center h-full">
        loading...
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2 px-6 py-4">
          <FolderIcon className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">/</span>
          <div className="flex items-center gap-2">
            <FileIcon className="w-5 h-5 text-foreground" />
            <span className="text-sm font-medium text-foreground">Files</span>
          </div>
        </div>
      </div>

      {/* Documents list */}
      <div className="p-6">
        <div className="space-y-2">
          {Array.isArray(data) && data.length > 0 ? (
            data.map((docus) => (
              <MediaCard
                key={docus.id}
                name={docus.name}
                type="document"
                size={docus.size}
                onClick={() => {
                  localStorage.setItem("selectedDoc", docus.name);
                  setSelectedDoc(docus.name);
                  fetchResults(docus.name);
                  setIsClosed(false); // open display panel on click
                }}
              />
            ))
          ) : (
            <div>No documents found.</div>
          )}
        </div>
      </div>

      {/* Document display panel */}
      {selectedDoc && (
        <div
          className={`${isClosed ? 'invisible' : 'visible'} absolute bottom-0 left-[50%] transform -translate-x-[50%] z-50 backdrop-blur-md bg-black/30 border-t border-white/10 shadow-xl px-4 py-4 flex flex-col items-center justify-between gap-4 h-[100vh] w-[90%]`}
        >
          <div className="text-white text-sm px-2 font-medium">
            Document name: {selectedDoc}
          </div>
          <div className="w-[50%] h-[100vh] overflow-auto rounded-lg bg-white p-4 text-black whitespace-pre-wrap">
            {isLoadingDisplay ? "loading..." : displayFile?.content || "No content to display."}
          </div>
          <button
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            onClick={toggleMediaDoc}
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      )}
    </div>
  );
}

