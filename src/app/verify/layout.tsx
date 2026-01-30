import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Certificate Verification | Shivkara Digital',
    description: 'Verify the authenticity of certificates issued by Shivkara Digital.',
    robots: {
        index: true,
        follow: true,
    },
};

export default function VerifyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
            {children}
        </div>
    );
}
