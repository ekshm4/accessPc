import { forwardRef } from 'react';

const variants = {
  primary: 'bg-accent text-accent-foreground hover:bg-accent/90',
  secondary: 'bg-muted text-muted-foreground hover:bg-muted/80',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  outline: 'border border-border bg-transparent hover:bg-muted hover:text-foreground',
  ghost: 'hover:bg-muted hover:text-foreground',
  link: 'text-accent underline-offset-4 hover:underline',
};

const sizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3',
  lg: 'h-11 px-8',
  icon: 'h-10 w-10',
};

export const Button = forwardRef(({
  className = '',
  variant = 'primary',
  size = 'default',
  disabled,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={`
        inline-flex items-center justify-center rounded-md text-sm font-medium 
        transition-colors focus-visible:outline-none focus-visible:ring-2 
        focus-visible:ring-accent disabled:opacity-50 disabled:pointer-events-none
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={disabled}
      {...props}
    />
  );
});

Button.displayName = 'Button';
