import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, X, Download, RefreshCw } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { media, stream, API_BASE } from '../../lib/api';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [content, setContent] = useState('');
  const [loadingContent, setLoadingContent] = useState(false);
  const navigate = useNavigate();

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const data = await media.getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const openDocument = async (doc) => {
    setSelectedDoc(doc);
    setLoadingContent(true);
    try {
      const url = stream.getDocumentUrl(doc.path);
      const response = await fetch(url);
      const data = await response.json();
      setContent(data.content || '');
    } catch (error) {
      console.error('Failed to load document:', error);
      setContent('Failed to load document content.');
    } finally {
      setLoadingContent(false);
    }
  };

  const downloadDocument = (doc) => {
    const url = stream.getDocumentUrl(doc.path);
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <PageHeader
        icon={FileText}
        title="Documents"
        breadcrumbs={['Documents']}
        action={
          <Button size="sm" onClick={fetchDocuments}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        }
      />

      <div className="p-6">
        <p className="text-sm text-muted-foreground mb-4">
          {documents.length} documents
        </p>

        {documents.length > 0 ? (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => openDocument(doc)}
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-accent cursor-pointer transition-colors group"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-white">
                    {doc.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{doc.sizeFormatted}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadDocument(doc);
                  }}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No documents found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Click "Refresh" to scan for documents
            </p>
          </div>
        )}
      </div>

      {selectedDoc && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-medium truncate">{selectedDoc.name}</h2>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => downloadDocument(selectedDoc)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedDoc(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {loadingContent ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
                </div>
              ) : (
                <pre className="whitespace-pre-wrap text-sm text-foreground font-mono">
                  {content}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
