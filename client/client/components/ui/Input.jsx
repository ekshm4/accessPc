import { forwardRef } from 'react';

export const Input = forwardRef(({
  className = '',
  type = 'text',
  ...props
}, ref) => {
  return (
    <input
      type={type}
      className={`
        flex h-10 w-full rounded-md border border-border 
        bg-background px-3 py-2 text-sm 
        placeholder:text-muted-foreground 
        focus-visible:outline-none focus-visible:ring-2 
        focus-visible:ring-accent disabled:cursor-not-allowed 
        disabled:opacity-50 ${className}
      `}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export const Label = forwardRef(({
  className = '',
  ...props
}, ref) => {
  return (
    <label
      ref={ref}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    />
  );
});

Label.displayName = 'Label';
