import path from 'path';

export const SERVERS = {
    support: {
        id: 'support',
        ip: '216.238.70.204',
        keyPath: path.join(process.cwd(), 'keys', 'id_vps_lms'),
        label: 'Support VPS (2GB)',
        services: [
            { name: 'n8n Workflows', url: 'http://216.238.70.204:5678' },
            { name: 'Dokploy Panel', url: 'http://216.238.70.204:3000' }
        ]
    },
    main: {
        id: 'main',
        ip: '64.177.81.23',
        keyPath: path.join(process.cwd(), 'keys', 'id_vps_main'),
        label: 'Main VPS (12GB)',
        services: [
            { name: 'Directus CMS (Port 8055)', url: 'http://64.177.81.23:8055/admin' },
            { name: 'Dokploy Panel', url: 'http://64.177.81.23:3000' },
            { name: 'Traefik Dashboard', url: 'http://64.177.81.23:8080' }
        ]
    },
    mirror: {
        id: 'mirror',
        ip: '64.177.80.253',
        keyPath: path.join(process.cwd(), 'keys', 'id_vps_mirror'),
        label: 'Mirror VPS 3 (12GB)',
        services: [
            { name: 'Directus Mirror (Port 8055)', url: 'http://64.177.80.253:8055/admin' },
            { name: 'Dokploy Panel', url: 'http://64.177.80.253:3000' }
        ]
    }
};
