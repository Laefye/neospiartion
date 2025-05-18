import { classNames, type Variant } from "./FormInput";

export function FileSelect({ label, id, className = '', variant = 'primary', ref, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; id: string, variant?: Variant, ref?: React.Ref<HTMLInputElement | null> }) {
    return (
        <div>
            {label && (
                <label htmlFor={id} className={classNames[variant].label}>
                {label}
                </label>
            )}
            <input
                ref={ref}
                id={id}
                type="file"
                className={`${className} file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-art-primary file:text-white`}
                {...rest}
            />
        </div>
    );
}