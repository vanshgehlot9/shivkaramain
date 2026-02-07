
import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                <p className="text-sm font-mono text-gray-500 uppercase tracking-widest">
                    Initializing Secure Link...
                </p>
            </div>
        </div>
    );
}
