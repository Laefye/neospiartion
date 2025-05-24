import { classNames, type Variant } from "./FormInput";

export function FormList({
    label,
    id,
    className = '',
    variant = 'primary',
    inputRef,
    options = [],
    ...rest
}: React.InputHTMLAttributes<HTMLSelectElement> & {
    label?: string;
    id: string;
    variant?: Variant;
    inputRef?: React.Ref<HTMLSelectElement>;
    options: React.ReactNode;
}) {
    return (
        <div>
            {label && (
                <label htmlFor={id} className={classNames[variant].label}>
                    {label}
                </label>
            )}
            <select
                ref={inputRef}
                id={id}
                className={`${classNames[variant].input} ${className}`}
                {...rest}>
                {options}
            </select>
        </div>
    );
}