export function FormInput({ label, id, className = '', ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; id: string }) {
    return (
        <div className={className}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-art-text-secondary mb-1">
                {label}
                </label>
            )}
            <input
                id={id}
                className='appearance-none rounded-lg bg-transparent border border-art-secondary text-art-text-primary w-full py-3 px-4 focus:outline-none focus:border-purple-500 placeholder:text-art-secondary'
                {...rest}
            />
        </div>
    );
}