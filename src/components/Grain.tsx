"use client";

export default function Grain() {
    return (
        <div
            className="fixed inset-0 pointer-events-none z-[90] opacity-[0.15] mix-blend-overlay"
            aria-hidden="true"
        >
            <div
                className="w-full h-full animate-grain"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                }}
            />
            <style jsx global>{`
                @keyframes grain {
                    0%, 100% { transform: translate(0, 0); }
                    10% { transform: translate(-2%, -2%); }
                    20% { transform: translate(-4%, 2%); }
                    30% { transform: translate(2%, -4%); }
                    40% { transform: translate(-2%, 4%); }
                    50% { transform: translate(-4%, 2%); }
                    60% { transform: translate(4%, 0); }
                    70% { transform: translate(0, 4%); }
                    80% { transform: translate(-4%, 0); }
                    90% { transform: translate(4%, 2%); }
                }
                .animate-grain {
                    animation: grain 0.15s steps(8) infinite;
                }
            `}</style>
        </div>
    );
}
