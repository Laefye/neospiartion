interface DividerProps {
    text?: string;
    bgColor?: string;
}

export function Divider({ text, bgColor = 'var(--color-art-bg-dark)' }: DividerProps) {
    return (
        <div className="relative">
        <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
        </div>
        {text && (
            <div className="relative flex justify-center">
            <span className="px-3 text-sm text-art-text-secondary" style={{ backgroundColor: bgColor }}>
                {text}
            </span>
            </div>
        )}
        </div>
    );
}
