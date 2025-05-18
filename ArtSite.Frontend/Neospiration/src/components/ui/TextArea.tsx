import { classNames, type Variant } from "./FormInput";

export function TextArea({ label, id, className = '', variant = 'primary', ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; id: string, variant?: Variant }) {
    return (
        <div>
            {label && (
                <label htmlFor={id} className={classNames[variant].label}>
                {label}
                </label>
            )}
            <textarea
                id={id}
                className={`${classNames[variant].input} ${className}`}
                {...rest}
            ></textarea>
        </div>
    );
}