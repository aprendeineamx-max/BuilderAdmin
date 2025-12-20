import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, User as UserIcon, Tag, Share2 } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 3600;

interface Props {
    params: {
        slug: string;
    }
}

export async function generateMetadata({ params }: Props) {
    // const supabase = createClient();
    const { data: post } = await supabase
        .from('posts')
        .select('title, excerpt, cover_image')
        .eq('slug', params.slug)
        .single();

    if (!post) return { title: 'Post no encontrado' };

    return {
        title: `${post.title} | INEA.mx`,
        description: post.excerpt,
        openGraph: {
            images: post.cover_image ? [post.cover_image] : [],
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    // const supabase = createClient();

    const { data: post, error } = await supabase
        .from('posts')
        .select(`
            *,
            author:author_id(full_name, avatar_url)
        `)
        .eq('slug', params.slug)
        .eq('published', true)
        .single();

    if (error || !post) {
        notFound();
    }

    const date = new Date(post.published_at).toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Navbar />

            {/* Header / Cover */}
            <header className="relative w-full h-[50vh] min-h-[400px] flex items-end">
                <div className="absolute inset-0 bg-slate-900">
                    {post.cover_image && (
                        <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-full object-cover opacity-60"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 w-full pb-12">
                    <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags?.map((tag: string) => (
                            <span key={tag} className="px-3 py-1 bg-indigo-600/90 text-white text-sm font-semibold rounded-full backdrop-blur-sm">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-6 text-slate-300 text-sm md:text-base">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden border-2 border-slate-600">
                                {post.author?.avatar_url && (
                                    <img src={post.author.avatar_url} alt={post.author.full_name} />
                                )}
                            </div>
                            <span className="font-medium text-white">{post.author?.full_name || 'Equipo INEA'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            {date}
                        </div>
                    </div>
                </div>
            </header>

            {/* Content Body */}
            <article className="max-w-4xl mx-auto px-4 py-16">
                <div className="prose prose-lg dark:prose-invert prose-indigo mx-auto bg-white dark:bg-slate-800 p-8 md:p-12 rounded-2xl shadow-sm">
                    <ReactMarkdown
                        components={{
                            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4 border-b pb-2 border-slate-200 dark:border-slate-700" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-8 mb-4 text-indigo-600 dark:text-indigo-400" {...props} />,
                            p: ({ node, ...props }) => <p className="mb-6 leading-relaxed text-slate-700 dark:text-slate-300" {...props} />,
                            li: ({ node, ...props }) => <li className="mb-2" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-bold text-slate-900 dark:text-white" {...props} />,
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>

                {/* Footer Tags & Share */}
                <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-700 pt-8">
                    <Link href="/blog" className="text-indigo-600 font-semibold hover:underline">
                        &larr; Volver al Blog
                    </Link>

                    <div className="flex gap-2">
                        <button className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                            <Share2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </button>
                    </div>
                </div>
            </article>

            <Footer />
        </main>
    );
}
