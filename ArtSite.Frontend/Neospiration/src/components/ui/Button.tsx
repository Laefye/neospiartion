import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'white';
  children: ReactNode;
  isLoading?: boolean;
}

export function Button({ 
  variant = 'primary', 
  children, 
  isLoading = false,
  className = '',
  ...rest 
}: ButtonProps) {
  const baseStyles = "flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium focus:outline-none";
  
  const variantStyles = {
    primary: "text-white bg-art-primary hover:bg-art-primary-hover border-transparent transition-colors duration-100",
    white: "text-gray-900 bg-white hover:bg-gray-100 border-transparent"
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? (
        <>
          <LoadingSpinner/>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
