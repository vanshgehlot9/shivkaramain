"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center selection:bg-[#FF7A00] selection:text-black">
            <div className="w-24 h-24 bg-[#FF7A00]/10 rounded-full flex items-center justify-center mb-8 border border-[#FF7A00]/20">
                <AlertTriangle className="w-12 h-12 text-[#FF7A00]" />
            </div>

            <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
                Something went <span className="text-[#FF7A00]">wrong!</span>
            </h2>

            <p className="text-gray-400 max-w-md mb-8 text-lg">
                We apologize for the inconvenience. An unexpected error has occurred.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => reset()}
                    className="px-8 py-3 bg-[#FF7A00] text-black font-bold rounded-xl hover:bg-[#FF7A00]/90 transition-colors flex items-center justify-center gap-2"
                >
                    <RefreshCw size={20} />
                    Try again
                </button>

                <Link
                    href="/"
                    className="px-8 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                >
                    <Home size={20} />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
