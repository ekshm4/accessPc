import { ChevronRight, SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PageHeader({ 
  icon: Icon, 
  title, 
  description, 
  breadcrumbs = [],
  action 
}) {
  return (
    <div className="border-b border-border bg-background/95 backdrop-blur">
      <div className="flex flex-col gap-1 px-6 py-4">
        {breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>/</span>
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-1">
                {index > 0 && <ChevronRight className="w-3 h-3" />}
                <span className={index === breadcrumbs.length - 1 ? 'text-foreground' : ''}>
                  {crumb}
                </span>
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {action}
            <Link
              to="/settings"
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <SettingsIcon className="w-5 h-5 text-muted-foreground" />
            </Link>
          </div>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
