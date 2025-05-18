export default function Container({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={`p-2.5 rounded-lg bg-white ${className}`}>
            {children}
        </div>
    );
}