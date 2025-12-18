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
            conn.on('ready', () => {
                conn.exec('uptime && free -h | grep Mem', (err: any, stream: any) => {
                    if (err) {
                        conn.end();
                        resolve(NextResponse.json({ status: 'error', message: err.message }));
                        return;
                    }
                    let output = '';
                    stream.on('data', (data: any) => output += data).on('close', () => {
                        conn.end();
                        resolve(NextResponse.json({ status: 'online', details: output.trim() }));
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
