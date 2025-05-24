import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'white' | 'outline' | 'secondary' | 'ghost' | 'submenu' | 'danger' | 'success' | 'warning' | 'accept';
  children: ReactNode;
  isLoading?: boolean;
}

export const baseStyles = "flex items-center justify-center rounded-lg text-lg font-medium focus:outline-none disabled:opacity-50";
  
export const variantStyles = {
  primary: "text-white bg-art-primary hover:bg-art-primary-hover border-transparent transition-colors duration-100 py-3 px-4",
  white: "text-gray-900 bg-white hover:bg-gray-100 border-transparent py-3 px-4",
  outline: "text-art-primary border border-art-primary border-2 bg-transparent hover:bg-art-primary hover:text-white transition-colors duration-100 py-1 px-4",
  secondary: "text-gray-900 bg-gray-100 hover:bg-gray-200 border-transparent py-3 px-4",
  danger: "text-red-600 bg-red-100 hover:bg-red-200 border-transparent py-3 px-4",
  success: "text-green-600 bg-green-100 hover:bg-green-200 border-transparent py-3 px-4",
  warning: "text-yellow-600 bg-yellow-100 hover:bg-yellow-200 border-transparent py-3 px-4",
  ghost: "text-gray-900 bg-transparent hover:bg-gray-100 border-transparent py-3 px-4",
  accept: "text-green-600 bg-green-100 hover:bg-green-200 border-transparent py-3 px-4",
  submenu: "py-2 rounded-none"
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

export default Button;
