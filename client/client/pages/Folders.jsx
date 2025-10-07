import { FolderIcon } from "lucide-react";

export default function Folders() {
  return (
    <div className="h-full overflow-auto">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2 px-6 py-4">
          <FolderIcon className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">/</span>
          <div className="flex items-center gap-2">
            <FolderIcon className="w-5 h-5 text-foreground" />
            <span className="text-sm font-medium text-foreground">Folders</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="text-center py-12">
          <FolderIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Folder Navigation</h3>
          <p className="text-muted-foreground mb-4">
            Browse your files organized by folders and directories.
          </p>
          <p className="text-sm text-muted-foreground">
            Continue prompting to implement the folder tree functionality.
          </p>
        </div>
      </div>
    </div>
  );
}
