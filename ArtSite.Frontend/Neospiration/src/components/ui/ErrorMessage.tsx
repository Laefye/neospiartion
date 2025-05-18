import { Link } from 'react-router';

interface ErrorMessageProps {
    message: string;
    redirectTo?: string;
    buttonText?: string;
}

export function ErrorMessage({ message, redirectTo, buttonText }: ErrorMessageProps) {
    return (
        <div className="bg-red-400/20 border border-red-400 text-red-200 px-4 py-3 rounded-lg max-w-md">
        <p className="font-bold">Ошибка</p>
        <p>{message}</p>
        {redirectTo && buttonText && (
            <div className="mt-4">
            <Link 
                to={redirectTo} 
                className="block w-full text-center py-2 px-4 bg-white hover:bg-gray-100 text-[#6c2769] border border-[#6c2769] rounded-lg"
            >
                {buttonText}
            </Link>
            </div>
        )}
        </div>
    );
}