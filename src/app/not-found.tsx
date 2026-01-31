import Link from "next/link";
import { FileQuestion, Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center p-6 text-center selection:bg-shivkara-orange/30 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-purple-600/10 to-blue-600/5 blur-[150px] rounded-full" />
            </div>

            <div className="relative z-10">
                <div className="w-28 h-28 bg-white/[0.03] backdrop-blur-xl rounded-full flex items-center justify-center mb-8 border border-white/10 mx-auto">
                    <FileQuestion className="w-14 h-14 text-gray-500" />
                </div>

                <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-400 to-gray-800 mb-4 tracking-tighter">
                    404
                </h1>

                <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight text-gray-300">
                    Page Not Found
                </h2>

                <p className="text-gray-500 max-w-md mb-10 text-lg mx-auto">
                    The page you're looking for has drifted into the void. Let's get you back on track.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-3 shadow-xl"
                    >
                        <Home size={20} />
                        Back to Home
                    </Link>
                    <Link
                        href="/contact"
                        className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-colors flex items-center justify-center gap-3"
                    >
                        <Search size={20} />
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}
