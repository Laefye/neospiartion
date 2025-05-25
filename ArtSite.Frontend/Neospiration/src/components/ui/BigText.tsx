export default function BigText({ textArea, className }: { textArea: string, className?: string }) {
    return (
        <div className={className}>
            {textArea.split('\n').map((line, index) => (
                <p key={index} className="mb-2">
                    {line}
                </p>
            ))}
        </div>
    );
}
