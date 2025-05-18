interface ErrorMessageProps {
    message: string;
    className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
    return (
        <div className={`bg-art-error border border-red-400 text-red-200 px-4 py-3 rounded-lg ${className}`}>
        <p className="font-bold">Ошибка</p>
        <p>{message}</p>
        </div>
    );
}