import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center selection:bg-[#FF7A00] selection:text-black">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10">
                <FileQuestion className="w-12 h-12 text-gray-400" />
            </div>

            <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-800 mb-2">
                404
            </h1>

            <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
                Page Not Found
            </h2>

            <p className="text-gray-400 max-w-md mb-8 text-lg">
                The page you are looking for doesn't exist or has been moved.
            </p>

            <Link
                href="/"
                className="px-8 py-3 bg-[#FF7A00] text-black font-bold rounded-xl hover:bg-[#FF7A00]/90 transition-colors flex items-center justify-center gap-2"
            >
                <Home size={20} />
                Back to Home
            </Link>
        </div>
    );
}
