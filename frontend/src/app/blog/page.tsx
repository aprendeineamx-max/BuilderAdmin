import { supabase } from '@/lib/supabase';
import BlogCard from '@/components/BlogCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Revalidate every hour
export const revalidate = 3600;

export default async function BlogPage() {
    // const supabase = createClient(); // REMOVED


    const { data: posts, error } = await supabase
        .from('posts')
        .select(`
            *,
            author:author_id(full_name, avatar_url)
        `)
        .eq('published', true)
        .order('published_at', { ascending: false });

    if (error) {
        console.error("Error fetching posts:", error);
    }

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                        Blog Inea.mx
                    </h1>
                    <p className="text-xl md:text-2xl text-indigo-100 max-w-2xl mx-auto">
                        Noticias, consejos de estudio y guías para alcanzar tu certificado.
                    </p>
                </div>
            </section>

            {/* Posts Grid */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    {!posts || posts.length === 0 ? (
                        <div className="text-center py-20">
                            <h3 className="text-2xl font-bold text-slate-400">Próximamente</h3>
                            <p className="text-slate-500">Estamos preparando contenido increíble para ti.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <div key={post.id} className="h-full">
                                    <BlogCard post={post} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
