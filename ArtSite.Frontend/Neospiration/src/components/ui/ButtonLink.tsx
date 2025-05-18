import type { LinkHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router';
import { baseStyles, variantStyles } from './Button';

interface ButtonLinkProps extends LinkHTMLAttributes<HTMLLinkElement> {
  variant?: 'primary' | 'white' | 'outline';
  children: ReactNode;
}

export default function ButtonLink({ 
  variant = 'primary', 
  children, 
  href,
  className = '',
}: ButtonLinkProps) {
  return (
    <Link
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      to={href!}
    >
      {children}
    </Link>
  );
}
