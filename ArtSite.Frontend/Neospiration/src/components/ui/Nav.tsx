import { Home, MessageSquare } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function Nav() {
    const auth = useAuth();
    return (
        <header className="bg-[#320425] py-3 px-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <a href="/" className="text-white text-xl font-bold">
                            NEOspiration
                        </a>
                    </div>

                    <div className="flex items-center space-x-4">
                        <a href="/" className="text-white hover:text-gray-200">
                            <Home size={24} />
                        </a>
                        {auth.me && (
                            <>
                                <a href="/messages" className="text-white hover:text-gray-200">
                                    <MessageSquare size={24} />
                                </a>
                            </>
                        )}

                        <div className="relative">
                            <button
                                className="flex items-center text-white hover:text-gray-200"
                            >
                                <span className="mr-1">Cool Artist</span>
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
    );
}