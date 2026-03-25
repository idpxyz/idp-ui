'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@idpxyz/ui-utils';

const avatarVariants = cva(
  'relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 bg-vscode-accent/15 text-vscode-accent font-semibold ring-2 ring-vscode-border/30',
  {
    variants: {
      size: {
        xs: 'h-5 w-5 text-[9px]',
        sm: 'h-6 w-6 text-[10px]',
        md: 'h-8 w-8 text-[12px]',
        lg: 'h-10 w-10 text-[14px]',
        xl: 'h-12 w-12 text-[16px]',
      },
    },
    defaultVariants: { size: 'md' },
  }
);

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, alt, fallback, ...props }, ref) => {
    const [imgError, setImgError] = React.useState(false);
    const initials = fallback || (alt ? alt.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?');

    return (
      <div ref={ref} className={cn(avatarVariants({ size, className }))} {...props}>
        {src && !imgError ? (
          <img src={src} alt={alt || ''} className="h-full w-full object-cover" onError={() => setImgError(true)} />
        ) : (
          <span aria-hidden="true">{initials}</span>
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';

export { Avatar, avatarVariants };
