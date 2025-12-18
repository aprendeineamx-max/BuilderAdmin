'use client';
import { useState, useEffect } from 'react';
import { Server, ShieldCheck, ShieldAlert, Database, Terminal, ExternalLink } from 'lucide-react';

interface Service {
    name: string;
    url: string;
}

interface ServerCardProps {
    id: string;
    label: string;
    ip: string;
    services: Service[];
}

export default function ServerCard({ id, label, ip, services }: ServerCardProps) {
    const [status, setStatus] = useState<'loading' | 'online' | 'offline'>('loading');
    const [details, setDetails] = useState('');
    const [backupLog, setBackupLog] = useState('');
    const [isBackingUp, setIsBackingUp] = useState(false);

    useEffect(() => {
        checkStatus();
        const interval = setInterval(checkStatus, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    const checkStatus = async () => {
        try {
            const res = await fetch('/api/status', {
                method: 'POST',
                body: JSON.stringify({ serverId: id }),
            });
            const data = await res.json();
            setStatus(data.status);
            setDetails(data.details || data.message || '');
        } catch (e) {
            setStatus('offline');
        }
    };

    const handleBackup = async () => {
        if (!confirm(`Start FULL BACKUP for ${label}?`)) return;
        setIsBackingUp(true);
        setBackupLog('Starting backup process...\n');

        try {
            const res = await fetch('/api/backup', {
                method: 'POST',
                body: JSON.stringify({ serverId: id }),
            });
            const data = await res.json();
            setBackupLog(prev => prev + (data.log || data.message));
            if (data.status === 'success') {
                alert('Backup Completed Successfully!');
            } else {
                alert('Backup Failed. Check logs.');
            }
        } catch (e) {
            setBackupLog(prev => prev + '\nError calling API.');
        } finally {
            setIsBackingUp(false);
        }
    };

    return (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Server className="w-5 h-5 text-blue-400" />
                        {label}
                    </h3>
                    <p className="text-slate-400 text-sm font-mono mt-1">{ip}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${status === 'online' ? 'bg-green-900/50 text-green-400 border border-green-700' :
                        status === 'loading' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-700' :
                            'bg-red-900/50 text-red-400 border border-red-700'
                    }`}>
                    {status.toUpperCase()}
                </div>
            </div>

            <div className="bg-slate-900/50 rounded p-3 mb-4 h-24 overflow-y-auto font-mono text-xs text-slate-300">
                {status === 'loading' ? 'Checking connection...' : details}
            </div>

            <div className="grid grid-cols-1 gap-2 mb-4">
                {services.map((svc) => (
                    <a
                        key={svc.url}
                        href={svc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-sm text-blue-400 transition-colors"
                    >
                        <span className="flex items-center gap-2">
                            <ExternalLink className="w-3 h-3" />
                            {svc.name}
                        </span>
                    </a>
                ))}
            </div>

            <div className="flex gap-2">
                <button
                    onClick={handleBackup}
                    disabled={status !== 'online' || isBackingUp}
                    className={`flex-1 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors ${isBackingUp ? 'bg-blue-600/50 cursor-wait' :
                            status === 'online' ? 'bg-blue-600 hover:bg-blue-500 text-white' :
                                'bg-slate-700 text-slate-500 cursor-not-allowed'
                        }`}
                >
                    <Database className="w-4 h-4" />
                    {isBackingUp ? 'Backing up...' : 'Full Backup'}
                </button>
            </div>

            {backupLog && (
                <div className="mt-4 p-3 bg-black rounded border border-slate-700 text-green-400 font-mono text-xs h-32 overflow-y-auto whitespace-pre-wrap">
                    {backupLog}
                </div>
            )}
        </div>
    );
}
