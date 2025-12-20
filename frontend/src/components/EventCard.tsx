"use client";

import { Card, Badge, Button } from "@/components/ui";

interface Event {
    id: number;
    title: string;
    description: string;
    start_time: string;
    status: 'scheduled' | 'live' | 'ended';
    instructor_name: string;
}

export default function EventCard({ event }: { event: Event }) {
    const startDate = new Date(event.start_time);
    const isLive = event.status === 'live';

    return (
        <Card className={`flex flex-col md:flex-row gap-6 p-6 transition-all hover:bg-white/5 ${isLive ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}>
            {/* Date Box */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 bg-slate-800 rounded-2xl border border-white/5">
                <span className="text-xs text-red-400 font-bold uppercase">{startDate.toLocaleDateString('es-MX', { month: 'short' })}</span>
                <span className="text-2xl font-bold text-white">{startDate.getDate()}</span>
                <span className="text-xs text-gray-500">{startDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            {/* Info */}
            <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                            {isLive && <Badge variant="error" className="animate-pulse">🔴 EN VIVO</Badge>}
                            <span className="text-xs text-blue-400 font-bold tracking-wider uppercase">Clase Maestra</span>
                        </div>
                        <h3 className="text-xl font-bold text-white">{event.title}</h3>
                    </div>
                    <Badge variant="default">{event.instructor_name}</Badge>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>

                <div className="flex gap-3">
                    {isLive ? (
                        <Button variant="primary" size="sm" className="w-full md:w-auto bg-red-600 hover:bg-red-500 border-none">
                            ▶ Ver Transmisión
                        </Button>
                    ) : (
                        <Button variant="secondary" size="sm" className="w-full md:w-auto">
                            🔔 Recordarme
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}
