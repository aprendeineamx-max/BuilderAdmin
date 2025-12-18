import { NextResponse } from 'next/server';
import { SERVERS } from '../../../../vps-config';
import { Client } from 'ssh2';
import fs from 'fs';

export async function POST(req: Request) {
    try {
        const { serverId } = await req.json();
        const server = Object.values(SERVERS).find(s => s.id === serverId);

        if (!server) return NextResponse.json({ error: 'Server not found' }, { status: 404 });

        return new Promise((resolve) => {
            const conn = new Client();
            const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
            const archivePath = `/tmp/backup_${serverId}_${dateStr}.tar.gz`;
            const cmd = `tar -czf ${archivePath} /etc/dokploy /root/deployments /var/lib/docker/volumes 2>/dev/null && echo "BACKUP_SUCCESS: ${archivePath}"`;

            conn.on('ready', () => {
                conn.exec(cmd, (err: any, stream: any) => {
                    if (err) {
                        conn.end();
                        resolve(NextResponse.json({ status: 'error', message: err.message }));
                        return;
                    }
                    let output = '';
                    stream.on('data', (data: any) => output += data).on('close', () => {
                        conn.end();
                        if (output.includes('BACKUP_SUCCESS')) {
                            resolve(NextResponse.json({ status: 'success', path: archivePath, log: output }));
                        } else {
                            resolve(NextResponse.json({ status: 'failed', log: output }));
                        }
                    });
                });
            }).on('error', (err: any) => {
                resolve(NextResponse.json({ status: 'offline', message: err.message }));
            }).connect({
                host: server.ip,
                port: 22,
                username: 'root',
                privateKey: fs.readFileSync(server.keyPath)
            });
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
