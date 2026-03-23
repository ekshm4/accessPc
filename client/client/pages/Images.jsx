import { useState, useEffect } from 'react';
import { ImageIcon, X, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { LoadingScreen } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { media, stream } from '../../lib/api';

export default function Images() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const data = await media.getImages();
      setImages(data);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const openViewer = (image) => {
    setSelectedImage(image);
    setViewerOpen(true);
  };

  const closeViewer = () => {
    setViewerOpen(false);
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    const currentIndex = images.findIndex(img => img.id === selectedImage?.id);
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < images.length) {
      setSelectedImage(images[newIndex]);
    }
  };

  const currentIndex = selectedImage ? images.findIndex(img => img.id === selectedImage.id) : -1;

  if (loading) {
    return (
      <div className="h-full">
        <PageHeader
          icon={ImageIcon}
          title="Images"
          breadcrumbs={['Images']}
        />
        <div className="flex items-center justify-center h-[calc(100%-60px)]">
          <LoadingScreen text="Loading images..." />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <PageHeader
        icon={ImageIcon}
        title="Images"
        breadcrumbs={['Images']}
        action={
          <Button size="sm" onClick={fetchImages}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        }
      />

      <div className="p-6">
        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="card p-2 cursor-pointer hover:border-accent transition-colors group"
                onClick={() => openViewer(image)}
              >
                <div className="aspect-square bg-muted rounded-md overflow-hidden">
                  <img
                    src={stream.getImageUrl(image.name)}
                    alt={image.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2 truncate" title={image.name}>
                  {image.name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No images found</p>
            <p className="text-sm text-muted-foreground">
              Click "Scan" in the Folders page to scan your media library
            </p>
          </div>
        )}
      </div>

      {viewerOpen && selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={closeViewer}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {currentIndex > 0 && (
            <button
              onClick={() => navigateImage(-1)}
              className="absolute left-4 p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
          )}

          <img
            src={stream.getImageUrl(selectedImage.name)}
            alt={selectedImage.name}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23333" width="100" height="100"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%23666" font-size="12">Image Error</text></svg>';
            }}
          />

          {currentIndex < images.length - 1 && (
            <button
              onClick={() => navigateImage(1)}
              className="absolute right-4 p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-lg">
            {selectedImage.name} ({currentIndex + 1}/{images.length})
          </div>
        </div>
      )}
    </div>
  );
}
