"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home, Zap } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center p-6 text-center selection:bg-shivkara-orange/30 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-red-600/10 to-orange-600/5 blur-[150px] rounded-full animate-pulse" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10"
            >
                <div className="w-28 h-28 bg-gradient-to-br from-red-500/20 to-orange-500/10 backdrop-blur-xl rounded-full flex items-center justify-center mb-8 border border-red-500/20 mx-auto shadow-2xl shadow-red-500/10">
                    <AlertTriangle className="w-14 h-14 text-red-500" />
                </div>

                <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                    Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Broke</span>
                </h2>

                <p className="text-gray-400 max-w-md mb-10 text-lg mx-auto leading-relaxed">
                    An unexpected error occurred. Don't worry, our systems are on it.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => reset()}
                        className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-3 shadow-xl"
                    >
                        <RefreshCw size={20} />
                        Try Again
                    </motion.button>

                    <Link
                        href="/"
                        className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-colors flex items-center justify-center gap-3"
                    >
                        <Home size={20} />
                        Go Home
                    </Link>
                </div>

                {error.digest && (
                    <p className="mt-8 text-xs text-gray-600 font-mono">
                        Error Reference: {error.digest}
                    </p>
                )}
            </motion.div>
        </div>
    );
}
