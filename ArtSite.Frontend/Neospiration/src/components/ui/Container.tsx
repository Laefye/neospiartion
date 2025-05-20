export default function Container({ children, className, withoutPadding }: { children: React.ReactNode, className?: string, withoutPadding?: boolean }) {
    return (
        <div className={`${withoutPadding === true ? '' : 'p-2.5' } rounded-lg bg-white ${className}`}>
            {children}
        </div>
    );
}