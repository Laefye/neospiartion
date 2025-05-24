import type { ReactNode } from 'react';

interface HeaderProps {
    title: ReactNode;
    actions?: ReactNode;
    description?: string;
    className?: string;
}

export default function Header({ title, actions, description, className = '' }: HeaderProps) {
    return (
        <div className={`w-full ${className}`}>
            <div className="flex items-center justify-between w-full">
                <h1 className="text-3xl font-bold">{title}</h1>
                {actions && <div className="flex items-center space-x-3">{actions}</div>}
            </div>
            {description && <p className="mt-2 text-gray-300">{description}</p>}
        </div>
    );
}
