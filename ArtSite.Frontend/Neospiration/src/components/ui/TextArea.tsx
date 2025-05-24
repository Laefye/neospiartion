import { classNames, type Variant } from "./FormInput";

export function TextArea({ label, id, className = '', variant = 'primary', ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; id: string, variant?: Variant, inputRef?: React.Ref<HTMLTextAreaElement> }) {
    return (
        <div>
            {label && (
                <label htmlFor={id} className={classNames[variant].label}>
                {label}
                </label>
            )}
            <textarea
                ref={rest.inputRef}
                id={id}
                className={`${classNames[variant].input} ${className}`}
                {...rest}
            ></textarea>
        </div>
    );
}