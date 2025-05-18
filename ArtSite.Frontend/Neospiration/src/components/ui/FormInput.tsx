export type Variant = 'primary' | 'white';

export const classNames = {
    'primary': {
        'input': 'appearance-none rounded-lg bg-transparent border border-art-secondary text-black w-full py-3 px-4 focus:outline-none focus:border-purple-500 placeholder:text-art-secondary text-lg',
        'label': 'block text-sm text-gray-500 mb-1'
    },
    'white': {
        'input': 'appearance-none rounded-lg bg-transparent border border-art-secondary text-art-text-primary w-full py-3 px-4 focus:outline-none focus:border-purple-500 placeholder:text-art-secondary text-lg',
        'label': 'block text-sm font-medium text-art-text-secondary mb-1'
    }
}


export function FormInput({ label, id, className = '', variant = 'primary', ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; id: string, variant?: Variant }) {
    return (
        <div>
            {label && (
                <label htmlFor={id} className={classNames[variant].label}>
                {label}
                </label>
            )}
            <input
                id={id}
                className={`${classNames[variant].input} ${className}`}
                {...rest}
            />
        </div>
    );
}