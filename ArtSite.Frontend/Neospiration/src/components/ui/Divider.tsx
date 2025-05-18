interface DividerProps {
    text?: string;
}

export function Divider({ text }: DividerProps) {
    return (
        <div className="flex items-center my-8">
            <div className="h-px bg-art-secondary grow"></div>
            <span className="mx-2 text-art-secondary">{text}</span>
            <div className="h-px bg-art-secondary grow"></div>
        </div>
    );
}
