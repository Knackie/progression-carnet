import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Carnet de Progression',
    short_name: 'Carnet',
    description: 'Journal de progression pour le badminton et les échecs',
    start_url: '/dashboard',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#1e3a8a',
    theme_color: '#2563eb',
    lang: 'fr',
    icons: [
      { src: '/icon/192', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon/512', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon/512', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
