import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NoiseBackground from "@/components/ui/NoiseBackground";
import { blogPosts } from "@/data/blogPosts";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);
    if (!post) return { title: "Post Not Found" };

    return {
        title: `${post.title} | Shivkara Insights`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
            authors: [post.author],
            publishedTime: post.date,
            images: [post.image],
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "image": post.image,
        "author": {
            "@type": "Person",
            "name": post.author
        },
        "publisher": {
            "@type": "Organization",
            "name": "Shivkara Digital",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.shivkaradigital.com/logo.png"
            }
        },
        "datePublished": post.date,
        "description": post.excerpt
    };

    return (
        <main className="bg-black min-h-screen text-white selection:bg-shivkara-orange selection:text-black">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <NoiseBackground />
            <Navbar />

            <article className="pt-32 pb-20">
                {/* Hero Header */}
                <div className="container mx-auto px-6 max-w-4xl text-center mb-16">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-shivkara-orange mb-8 text-sm font-mono uppercase tracking-widest transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Insights
                    </Link>

                    <div className="flex items-center justify-center gap-4 text-xs font-mono text-gray-400 mb-6">
                        <span className="px-3 py-1 rounded-full border border-white/10 text-shivkara-orange bg-shivkara-orange/5">{post.category}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                        {post.title}
                    </h1>

                    <p className="text-xl text-gray-400 font-light leading-relaxed max-w-2xl mx-auto">
                        {post.excerpt}
                    </p>
                </div>

                {/* Featured Image */}
                <div className="container mx-auto px-4 max-w-6xl mb-20">
                    <div className="aspect-[21/9] w-full rounded-3xl overflow-hidden relative border border-white/10">
                        <div className="absolute inset-0 bg-shivkara-orange/10 mix-blend-overlay z-10" />
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover grayscale opacity-90"
                        />
                    </div>
                </div>

                {/* Content Body */}
                <div className="container mx-auto px-6 max-w-3xl">
                    <div
                        className="prose prose-invert prose-lg md:prose-xl prose-headings:font-bold prose-headings:tracking-tight prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-shivkara-orange prose-strong:text-white"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <div className="mt-16 pt-8 border-t border-white/10">
                        <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-4">Written By</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-800" />
                            <div>
                                <p className="text-white font-bold">{post.author}</p>
                                <p className="text-xs text-gray-500">Editor @ Shivkara Digital</p>
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            <Footer />
        </main>
    );
}
