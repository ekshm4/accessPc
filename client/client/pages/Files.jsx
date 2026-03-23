import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderIcon, FileIcon, VideoIcon, ImageIcon, Music, FileText, RefreshCw, Filter } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { LoadingScreen } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { media } from '../../lib/api';

const typeIcons = {
  video: VideoIcon,
  image: ImageIcon,
  audio: Music,
  document: FileText,
};

const typeFilters = [
  { type: 'all', label: 'All', icon: FolderIcon },
  { type: 'video', label: 'Videos', icon: VideoIcon },
  { type: 'audio', label: 'Audio', icon: Music },
  { type: 'image', label: 'Images', icon: ImageIcon },
  { type: 'document', label: 'Documents', icon: FileText },
];

export default function Files() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const data = await media.getAll({ limit: 500 });
      setFiles(data.files || []);
    } catch (error) {
      console.error('Failed to fetch files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const filteredFiles = filter === 'all' 
    ? files 
    : files.filter(f => f.fileType === filter);

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
    } else if (file.fileType === 'image') {
      localStorage.setItem('viewingImage', JSON.stringify(file));
      navigate('/images');
    }
  };

  const getFileIcon = (type) => {
    const Icon = typeIcons[type] || FileIcon;
    return <Icon className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="h-full">
        <PageHeader
          icon={FolderIcon}
          title="All Files"
          breadcrumbs={['All Files']}
        />
        <div className="flex items-center justify-center h-[calc(100%-60px)]">
          <LoadingScreen text="Loading files..." />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <PageHeader
        icon={FolderIcon}
        title="All Files"
        breadcrumbs={['All Files']}
        action={
          <Button size="sm" onClick={fetchFiles}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        }
      />

      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {typeFilters.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                filter === type
                  ? 'bg-accent text-white'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <p className="text-sm text-muted-foreground mb-4">
          {filteredFiles.length} {filter === 'all' ? 'files' : filter + 's'}
        </p>

        {filteredFiles.length > 0 ? (
          <div className="space-y-2">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                onClick={() => handleFileClick(file)}
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-accent cursor-pointer transition-colors group"
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                  file.fileType === 'video' ? 'bg-red-500/20 text-red-400' :
                  file.fileType === 'audio' ? 'bg-purple-500/20 text-purple-400' :
                  file.fileType === 'image' ? 'bg-green-500/20 text-green-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {getFileIcon(file.fileType)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-white">
                    {file.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{file.sizeFormatted}</span>
                    {file.durationFormatted && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{file.durationFormatted}</span>
                      </>
                    )}
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground capitalize">{file.fileType}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FolderIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {filter === 'all' ? 'No files found' : `No ${filter} files found`}
            </p>
            <p className="text-sm text-muted-foreground">
              Click "Scan" in the Folders page to scan your media library
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
