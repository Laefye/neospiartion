import type { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export function FormInput({ label, id, className = '', ...rest }: FormInputProps) {
    return (
        <div className="w-full">
        {label && (
            <label htmlFor={id} className="block text-sm font-medium text-art-text-secondary mb-1">
            {label}
            </label>
        )}
        <input
            id={id}
            className={`appearance-none rounded-lg bg-transparent border border-art-border text-art-text-primary w-full py-3 px-4 focus:outline-none focus:border-purple-500 ${className}`}
            {...rest}
        />
        </div>
    );
}