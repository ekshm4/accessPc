import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="h-full flex items-center justify-center bg-background">
      <div className="text-center">
        <FileQuestion className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
        <p className="text-lg text-muted-foreground mb-4">Page not found</p>
        <Link
          to="/"
          className="text-accent hover:underline"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
