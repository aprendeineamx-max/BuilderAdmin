import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://inea.mx' // Production URL

    // Static routes
    const routes = [
        '',
        '/login',
        '/register',
        '/cursos',
        '/blog',
        '/comunidad',
        '/terminos',
        '/privacidad',
        '/ayuda',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }))

    // Dynamic Blog Posts
    const { data: posts } = await supabase
        .from('posts')
        .select('slug, updated_at')
        .eq('published', true);

    const blogRoutes = posts?.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    })) || [];

    return [...routes, ...blogRoutes];
}
