import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'white';
  children: ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({ 
  variant = 'primary', 
  children, 
  isLoading = false,
  fullWidth = true,
  className = '',
  ...rest 
}: ButtonProps) {
  const baseStyles = "flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium focus:outline-none";
  
  const variantStyles = {
    primary: "text-white bg-art-primary hover:bg-art-primary-hover border-transparent",
    secondary: "text-white bg-transparent border-art-border hover:border-purple-500",
    white: "text-gray-900 bg-white hover:bg-gray-100 border-transparent"
  };

  const widthClass = fullWidth ? "w-full" : "";
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthClass} ${className}`}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Загрузка...
        </>
      ) : (
        children
      )}
    </button>
  );
}
