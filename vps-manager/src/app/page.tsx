'use client';
import { SERVERS } from '../../vps-config';
import ServerCard from '@/components/ServerCard';
import { Activity } from 'lucide-react';

export default function Home() {
  const serverList = Object.values(SERVERS);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 p-8">
      <header className="max-w-6xl mx-auto mb-10 border-b border-slate-800 pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent flex items-center gap-3">
            <Activity className="text-blue-500" />
            Nexus Control
          </h1>
          <p className="text-slate-500 mt-1">Unified Infrastructure Management</p>
        </div>
        <div className="text-xs font-mono text-slate-600">
          v1.0.0
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serverList.map((server) => (
          <ServerCard
            key={server.id}
            id={server.id}
            label={server.label}
            ip={server.ip}
            services={server.services || []}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto mt-12 p-6 bg-slate-900 rounded-xl border border-slate-800">
        <h2 className="text-lg font-semibold mb-4 text-white">Global Actions</h2>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors border border-slate-700">
            Refresh All
          </button>
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors border border-slate-700">
            Download All Backups
          </button>
        </div>
      </div>
    </main>
  );
}
