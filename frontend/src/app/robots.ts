import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/dashboard/', '/perfil/', '/api/'], // Private areas
        },
        sitemap: 'https://inea.mx/sitemap.xml', // Production URL (to be updated)
    }
}
