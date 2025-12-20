import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    cover_image?: string;
    published_at: string;
    tags: string[];
    author?: {
        full_name: string;
        avatar_url: string;
    };
}

export default function BlogCard({ post }: { post: BlogPost }) {
    const date = new Date(post.published_at).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="group flex flex-col h-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Image Placeholder */}
            <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
                {post.cover_image ? (
                    <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-white/20 text-6xl font-black select-none">
                        BLOG
                    </div>
                )}

                <div className="absolute top-4 left-4 flex gap-2">
                    {post.tags?.map((tag) => (
                        <Badge key={tag} className="bg-white/90 text-indigo-700 backdrop-blur-sm">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 flex flex-col">
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {date}
                    </div>
                    {/* Placeholder for read time calculation if wanted */}
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        5 min lectura
                    </div>
                </div>

                <Link href={`/blog/${post.slug}`} className="block mb-3">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                        {post.title}
                    </h3>
                </Link>

                <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3 mb-6 flex-1">
                    {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                            {post.author?.avatar_url && (
                                <img src={post.author.avatar_url} alt={post.author.full_name} />
                            )}
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {post.author?.full_name || 'Equipo INEA'}
                        </span>
                    </div>
                    <Link
                        href={`/blog/${post.slug}`}
                        className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                        Leer más <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
