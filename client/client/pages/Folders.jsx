import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderIcon, ChevronRight, FileIcon, VideoIcon, ImageIcon, Music, FileText, RefreshCw } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { LoadingScreen } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { folders, media, stream } from '../../lib/api';

const typeIcons = {
  video: VideoIcon,
  image: ImageIcon,
  audio: Music,
  document: FileText,
};

export default function Folders() {
  const [foldersData, setFoldersData] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: 'Home' }]);
  const navigate = useNavigate();

  useEffect(() => {
    loadFolders(null);
  }, []);

  const loadFolders = async (parentId) => {
    setLoading(true);
    try {
      const data = await folders.getAll(parentId);
      setFoldersData(data);
      setFiles([]);
      setCurrentFolder(null);
    } catch (error) {
      console.error('Failed to fetch folders:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFolder = async (folder) => {
    setLoading(true);
    try {
      const data = await folders.getById(folder.id);
      setCurrentFolder(data);
      setFoldersData(data.children || []);
      setFiles(data.files || []);
      setBreadcrumbs([...breadcrumbs, { id: folder.id, name: folder.name }]);
    } catch (error) {
      console.error('Failed to fetch folder:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFolderClick = (folder) => {
    loadFolder(folder);
  };

  const handleBreadcrumbClick = (index) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    const folder = newBreadcrumbs[index];
    if (folder.id === null) {
      loadFolders(null);
    } else {
      loadFolder({ id: folder.id, name: folder.name });
    }
  };

  const handleScan = async () => {
    setScanning(true);
    try {
      await folders.scan();
      await loadFolders(null);
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setScanning(false);
    }
  };

  const handleFileClick = (file) => {
    if (file.fileType === 'video') {
      localStorage.setItem('playing', JSON.stringify({
        filename: file.name,
        mimetype: file.mimeType,
        id: file.id,
      }));
      navigate('/playing');
    } else if (file.fileType === 'audio') {
      localStorage.setItem('playingAudio', JSON.stringify(file));
      navigate('/audio');
    }
  };

  const getFileIcon = (type) => {
    const Icon = typeIcons[type] || FileIcon;
    return <Icon className="w-5 h-5 text-muted-foreground" />;
  };

  if (loading && !scanning) {
    return (
      <div className="h-full">
        <PageHeader
          icon={FolderIcon}
          title="Browse"
          breadcrumbs={breadcrumbs.map(b => b.name)}
          action={
            <Button size="sm" onClick={handleScan} disabled={scanning}>
              <RefreshCw className={`w-4 h-4 mr-2 ${scanning ? 'animate-spin' : ''}`} />
              Scan
            </Button>
          }
        />
        <div className="flex items-center justify-center h-[calc(100%-60px)]">
          <LoadingScreen text="Loading..." />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <PageHeader
        icon={FolderIcon}
        title={currentFolder?.name || 'Browse'}
        breadcrumbs={breadcrumbs.map(b => b.name)}
        action={
          <Button size="sm" onClick={handleScan} disabled={scanning}>
            <RefreshCw className={`w-4 h-4 mr-2 ${scanning ? 'animate-spin' : ''}`} />
            Scan
          </Button>
        }
      />

      <div className="flex items-center gap-1 px-6 py-3 border-b border-border overflow-x-auto">
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center gap-1">
            {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            <button
              onClick={() => handleBreadcrumbClick(index)}
              className={`text-sm px-2 py-1 rounded ${
                index === breadcrumbs.length - 1
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {crumb.name}
            </button>
          </div>
        ))}
      </div>

      <div className="p-6">
        {scanning && (
          <div className="mb-4 p-4 bg-accent/10 border border-accent/20 rounded-lg">
            <div className="flex items-center gap-2 text-accent">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Scanning media library...</span>
            </div>
          </div>
        )}

        {foldersData.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Folders</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {foldersData.map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => handleFolderClick(folder)}
                  className="flex flex-col items-center p-4 bg-card border border-border rounded-lg hover:border-accent cursor-pointer transition-colors"
                >
                  <FolderIcon className="w-10 h-10 text-accent mb-2" />
                  <span className="text-sm text-center truncate w-full">{folder.name}</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {folder._count?.files || 0} files, {folder._count?.children || 0} folders
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {files.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Files</h3>
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  onClick={() => handleFileClick(file)}
                  className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:border-accent cursor-pointer transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    {getFileIcon(file.fileType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{file.sizeFormatted}</span>
                      {file.durationFormatted && (
                        <>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{file.durationFormatted}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {foldersData.length === 0 && files.length === 0 && !scanning && (
          <div className="text-center py-12">
            <FolderIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {currentFolder ? 'This folder is empty' : 'No folders found'}
            </p>
            <Button onClick={handleScan} disabled={scanning}>
              <RefreshCw className={`w-4 h-4 mr-2 ${scanning ? 'animate-spin' : ''}`} />
              Scan Library
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
