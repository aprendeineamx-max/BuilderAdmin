const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const SERVERS = {
    support: {
        ip: '216.238.70.204',
        key: path.join(__dirname, 'id_vps_lms'),
        label: 'Support VPS (2GB)'
    },
    main: {
        ip: '64.177.81.23',
        key: path.join(__dirname, 'id_vps_main'),
        label: 'Main VPS (12GB)'
    },
    mirror: {
        ip: '64.177.80.253',
        key: path.join(__dirname, 'id_vps_mirror'),
        label: 'Mirror VPS 3 (12GB)'
    }
};

function runCommand(cmd, args, opts = {}) {
    return new Promise((resolve, reject) => {
        const proc = spawn(cmd, args, { stdio: 'inherit', shell: true, ...opts });
        proc.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`Command failed with code ${code}`));
        });
    });
}

async function connect(target) {
    const server = SERVERS[target];
    if (!server) throw new Error(`Unknown target: ${target}. Use 'main' or 'support'.`);

    console.log(`Connecting to ${server.label}...`);
    // Pass key explicitely. If key auth fails, ssh will ask for password.
    await runCommand('ssh', ['-i', `"${server.key}"`, '-o', 'StrictHostKeyChecking=no', `root@${server.ip}`]);
}

async function backup(target) {
    const server = SERVERS[target];
    if (!server) throw new Error(`Unknown target: ${target}. Use 'main' or 'support'.`);

    const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
    const dest = path.join(__dirname, 'backups', target, dateStr);
    const archivePath = `/tmp/dokploy_backup_${target}_${dateStr}.tar.gz`;

    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

    console.log(`[${server.label}] Creating remote archive (Configs + Deployments + Data Volumes)...`);
    // Backup:
    // 1. /etc/dokploy (Dokploy Settings)
    // 2. /root/deployments (Our manual Compose files)
    // 3. /var/lib/docker/volumes (Persistent Data - n8n, Postgres, Redis, etc.)
    await runCommand('ssh', ['-i', `"${server.key}"`, `root@${server.ip}`, `"tar -czf ${archivePath} /etc/dokploy /root/deployments /var/lib/docker/volumes 2>/dev/null"`]);

    console.log(`[${server.label}] Downloading archive...`);
    await runCommand('scp', ['-i', `"${server.key}"`, `root@${server.ip}:${archivePath}`, path.join(dest, 'config.tar.gz')]);

    console.log(`Backup saved to ${dest}`);
    await runCommand('ssh', ['-i', `"${server.key}"`, `root@${server.ip}`, `"rm ${archivePath}"`]);
}

const action = process.argv[2];
const target = process.argv[3] || 'main'; // Default to main if not specified

if (['connect', 'backup'].includes(action)) {
    if (!SERVERS[target]) {
        console.error('Invalid target. Available: main, support');
        process.exit(1);
    }
    if (action === 'connect') connect(target);
    else backup(target);
} else {
    console.log('Usage: node manage_vps.js [connect|backup] [main|support]');
}
