"use client";

export default function Grain() {
    return (
        <div className="fixed inset-0 pointer-events-none z-[90] opacity-20 mix-blend-overlay">
            <div className="w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] animate-noise" />
            <style jsx global>{`
                @keyframes noise {
                    0%, 100% { transform: translate(0, 0); }
                    10% { transform: translate(-5%, -5%); }
                    20% { transform: translate(-10%, 5%); }
                    30% { transform: translate(5%, -10%); }
                    40% { transform: translate(-5%, 15%); }
                    50% { transform: translate(-10%, 5%); }
                    60% { transform: translate(15%, 0); }
                    70% { transform: translate(0, 10%); }
                    80% { transform: translate(-15%, 0); }
                    90% { transform: translate(10%, 5%); }
                }
                .animate-noise {
                    animation: noise 0.2s steps(10) infinite;
                }
            `}</style>
        </div>
    );
}
