import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import Button from './Button';

interface NotificationWindowProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NotificationWindow({ isOpen, onClose }: NotificationWindowProps) {
    const windowRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (windowRef.current && !windowRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) 
        return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
            <div className="bg-gradient-to-br from-[#320425] to-[#25022A] w-[800px] h-[600px] rounded-lg shadow-2xl border border-purple-900/30"
                ref={windowRef}
            >
                <div className="flex justify-between items-center p-4 border-b border-purple-900/30">
                    <h2 className="text-xl font-bold text-white">Уведомления</h2>
                    <Button 
                        onClick={onClose}
                        variant="white"
                        className="p-2 rounded-full hover:bg-purple-900/20 transition-colors duration-200"
                    >
                        <X size={24} />
                    </Button>
                </div>
                
                <div className="p-6 h-[calc(600px-70px)] overflow-y-auto">
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="bg-purple-900/20 p-8 rounded-lg">
                            <p className="text-lg text-gray-300">
                                Вы еще не подписались ни на кого
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}