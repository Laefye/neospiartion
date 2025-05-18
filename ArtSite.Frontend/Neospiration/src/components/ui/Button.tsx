import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'white' | 'outline';
  children: ReactNode;
  isLoading?: boolean;
}

export const baseStyles = "flex items-center justify-center rounded-lg text-lg font-medium focus:outline-none disabled:opacity-50";
  
export const variantStyles = {
  primary: "text-white bg-art-primary hover:bg-art-primary-hover border-transparent transition-colors duration-100 py-3 px-4",
  white: "text-gray-900 bg-white hover:bg-gray-100 border-transparent py-3 px-4",
  outline: "text-art-primary border border-art-primary border-2 bg-transparent hover:bg-art-primary hover:text-white transition-colors duration-100 py-1 px-4",
};

export function Button({ 
  variant = 'primary', 
  children, 
  isLoading = false,
  className = '',
  ...rest 
}: ButtonProps) {
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
