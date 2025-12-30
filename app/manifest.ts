
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Umarel - Get things done',
        short_name: 'Umarel',
        description: 'The marketplace where experienced Umarels help you break down tasks.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        orientation: 'portrait',
        icons: [
            {
                src: '/icon.png',
                sizes: 'any',
                type: 'image/png',
            }
        ],
    };
}
