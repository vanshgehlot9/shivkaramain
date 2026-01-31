"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Lock, Mail, AlertCircle, ArrowRight, RefreshCw, Zap, Hexagon, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Mouse Movement Logic for Parallax
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 50, damping: 20 });
    const mouseY = useSpring(y, { stiffness: 50, damping: 20 });

    // Transforms for different layers (Parallax Effect)
    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);

    // Background Blobs Movement
    const blob1X = useTransform(mouseX, [-0.5, 0.5], ["-20px", "20px"]);
    const blob1Y = useTransform(mouseY, [-0.5, 0.5], ["-20px", "20px"]);
    const blob2X = useTransform(mouseX, [-0.5, 0.5], ["15px", "-15px"]);
    const blob2Y = useTransform(mouseY, [-0.5, 0.5], ["20px", "-20px"]);

    // Floating Icons Parallax (More pronounced)
    const iconMoveX = useTransform(mouseX, [-0.5, 0.5], ["-30px", "30px"]);
    const iconMoveY = useTransform(mouseY, [-0.5, 0.5], ["-30px", "30px"]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXVal = e.clientX - rect.left;
        const mouseYVal = e.clientY - rect.top;
        const xPct = mouseXVal / width - 0.5;
        const yPct = mouseYVal / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        await new Promise(r => setTimeout(r, 1200));

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/admin");
        } catch (err: any) {
            console.error("Login error:", err);
            // Simulated detailed error handling for effect
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError("ACCESS DENIED: Credentials Invalid");
            } else if (err.code === 'auth/too-many-requests') {
                setError("SECURITY LOCK: Too many attempts");
            } else {
                setError("NETWORK FAILURE: Connection lost");
            }
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center bg-[#050505] text-white relative overflow-hidden font-sans perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Ambient Background Audio or Noise potentially */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] z-50 pointer-events-none mix-blend-overlay" />

            {/* Moving 3D Background - Liquid Metal gradient blobs */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <motion.div
                    style={{ x: blob1X, y: blob1Y }}
                    className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-gradient-to-tr from-[#3b0d77] to-[#e100ff] rounded-full blur-[120px] opacity-40 mix-blend-screen animate-blob"
                />
                <motion.div
                    style={{ x: blob2X, y: blob2Y }}
                    className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-gradient-to-tl from-[#ff4d00] to-[#ffb700] rounded-full blur-[130px] opacity-30 mix-blend-screen animate-blob animation-delay-2000"
                />
                <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] opacity-20" />
            </div>

            {/* Floating CSS 3D Geometry */}
            <div className="absolute inset-0 z-5 pointer-events-none perspective-[800px] overflow-hidden">
                {/* Cube 1 */}
                <motion.div
                    animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[15%] right-[15%] w-20 h-20 border border-white/10 opacity-20"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    <div className="absolute inset-0 border border-white/20 translate-z-[10px]" />
                    <div className="absolute inset-0 border border-white/20 translate-z-[-10px]" />
                </motion.div>

                {/* Pyramid-ish shape */}
                <motion.div
                    animate={{ rotateY: [0, 360], y: [0, 20, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[20%] left-[10%] w-32 h-32 border border-[#FF4D00]/20 opacity-30"
                    style={{ transform: "rotateX(60deg) rotateZ(45deg)" }}
                />
            </div>


            {/* Main 3D Container */}
            <div className="relative z-10 w-full max-w-md px-6 perspective-[1200px]">
                <motion.div
                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {/* Floating Parallax Elements (Hovering above card) */}
                    <motion.div
                        style={{ x: iconMoveX, y: iconMoveY, z: 60 }}
                        className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-[#FF4D00] to-orange-600 rounded-2xl blur-[40px] opacity-40 pointer-events-none"
                    />
                    <motion.div
                        style={{ x: useTransform(iconMoveX, x => Number(x) * -1), y: useTransform(iconMoveY, y => Number(y) * -1), z: 80 }}
                        className="absolute -bottom-8 -left-8 w-20 h-20 bg-blue-500 rounded-full blur-[50px] opacity-30 pointer-events-none"
                    />

                    {/* THE CARD */}
                    <div className="relative bg-black/40 backdrop-blur-2xl rounded-[30px] border border-white/10 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden group">

                        {/* Shimmer Effect on Card Surface */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        {/* Internal Depth Layer */}
                        <div className="relative z-10 transform-style-3d translate-z-20">

                            {/* Header */}
                            <div className="mb-10 text-center">
                                <motion.div
                                    style={{ z: 40 }}
                                    className="w-20 h-20 mx-auto mb-6 relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#FF4D00] to-orange-500 rounded-2xl rotate-3 opacity-80 blur-lg animate-pulse" />
                                    <div className="absolute inset-0 bg-[#050505] rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-sm z-10">
                                        <div className="relative flex items-center justify-center">
                                            <Hexagon className="text-white w-10 h-10 absolute animate-spin-slow opacity-20" />
                                            <span className="font-black text-2xl bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">S</span>
                                        </div>
                                    </div>
                                    {/* Floating Shield Icon */}
                                    <motion.div
                                        animate={{ y: [-5, 5, -5] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute -top-2 -right-2 bg-gradient-to-br from-emerald-500 to-green-600 p-1.5 rounded-lg z-20 shadow-lg border border-white/20"
                                    >
                                        <ShieldCheck size={12} className="text-white" />
                                    </motion.div>
                                </motion.div>

                                <h1 className="text-3xl font-bold tracking-tight text-white mb-2 drop-shadow-md">Admin Portal</h1>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold tracking-widest uppercase text-gray-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Secure System
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleLogin} className="space-y-6">
                                <AnimatePresence mode="wait">
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200 text-xs font-medium backdrop-blur-md"
                                        >
                                            <AlertCircle size={16} className="text-red-500" />
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="space-y-4">
                                    {/* Email Input */}
                                    <div className="group space-y-2">
                                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1 group-focus-within:text-[#FF4D00] transition-colors">
                                            Email Identity
                                        </label>
                                        <div className="relative transition-transform duration-300 group-focus-within:scale-[1.02]">
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#FF4D00] to-orange-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-500" />
                                            <div className="relative bg-white/5 border border-white/10 rounded-xl flex items-center overflow-hidden focus-within:ring-1 focus-within:ring-[#FF4D00]/50 focus-within:border-[#FF4D00]/50 transition-all">
                                                <div className="pl-4 text-gray-500 group-focus-within:text-white transition-colors">
                                                    <Mail size={18} />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full bg-transparent border-none py-3.5 px-3 text-sm text-white placeholder:text-gray-600 focus:outline-none"
                                                    placeholder="Enter your ID"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Password Input */}
                                    <div className="group space-y-2">
                                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1 group-focus-within:text-[#FF4D00] transition-colors">
                                            Security Key
                                        </label>
                                        <div className="relative transition-transform duration-300 group-focus-within:scale-[1.02]">
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#FF4D00] to-orange-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-500" />
                                            <div className="relative bg-white/5 border border-white/10 rounded-xl flex items-center overflow-hidden focus-within:ring-1 focus-within:ring-[#FF4D00]/50 focus-within:border-[#FF4D00]/50 transition-all">
                                                <div className="pl-4 text-gray-500 group-focus-within:text-white transition-colors">
                                                    <Lock size={18} />
                                                </div>
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full bg-transparent border-none py-3.5 px-3 text-sm text-white placeholder:text-gray-600 focus:outline-none"
                                                    placeholder="••••••••"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(255, 77, 0, 0.4)" }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    disabled={loading}
                                    className="relative w-full overflow-hidden bg-gradient-to-r from-[#FF4D00] to-[#FF8000] text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                    <div className="relative flex items-center justify-center gap-2">
                                        {loading ? (
                                            <>
                                                <RefreshCw size={18} className="animate-spin" />
                                                <span className="text-sm tracking-wide">AUTHENTICATING...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-sm tracking-wide">ACCESS DASHBOARD</span>
                                                <Zap size={18} className="fill-white" />
                                            </>
                                        )}
                                    </div>
                                </motion.button>
                            </form>
                        </div>
                    </div>
                </motion.div>

                {/* Footer Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center mt-12 space-y-2 pointer-events-none"
                >
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium">Shivkara Digital Admin V3.0</p>
                    <div className="w-1 h-1 bg-white/20 rounded-full mx-auto" />
                </motion.div>
            </div>
        </div>
    );
}
