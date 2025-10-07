import { FileTextIcon, FolderIcon } from "lucide-react";

export default function Documents() {
  return (
    <div className="h-full overflow-auto">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2 px-6 py-4">
          <FolderIcon className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">/</span>
          <div className="flex items-center gap-2">
            <FileTextIcon className="w-5 h-5 text-foreground" />
            <span className="text-sm font-medium text-foreground">Documents</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="text-center py-12">
          <FileTextIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Document Viewer</h3>
          <p className="text-muted-foreground mb-4">
            View and manage your documents including PDFs, Word files, and more.
          </p>
          <p className="text-sm text-muted-foreground">
            Continue prompting to implement the document viewer functionality.
          </p>
        </div>
      </div>
    </div>
  );
}
