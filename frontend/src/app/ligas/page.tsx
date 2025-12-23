"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trophy, Medal, Star, Shield, ArrowUp } from "lucide-react";

export default function LeaguesPage() {
    const leagues = [
        { name: 'Diamante', icon: '💎', color: 'from-cyan-400 to-blue-600', active: false },
        { name: 'Oro', icon: '🥇', color: 'from-yellow-300 to-yellow-600', active: true },
        { name: 'Plata', icon: '🥈', color: 'from-slate-300 to-slate-500', active: false },
        { name: 'Bronce', icon: '🥉', color: 'from-orange-700 to-orange-900', active: false },
    ];

    const leaderboard = [
        { rank: 1, name: 'Ana María', xp: 2450, avatar: '👩‍🚀', trend: 'up' },
        { rank: 2, name: 'Tu Usuario', xp: 2100, avatar: '👤', trend: 'same', isMe: true },
        { rank: 3, name: 'Pedro Luis', xp: 1980, avatar: '👨‍🏫', trend: 'down' },
        { rank: 4, name: 'Sofia G.', xp: 1850, avatar: '👩‍🎓', trend: 'up' },
        { rank: 5, name: 'Carlos R.', xp: 1720, avatar: '🕵️‍♂️', trend: 'down' },
    ];

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            <Navbar />

            <main className="flex-1 pt-24 pb-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">Ligas Competitivas</h1>
                        <p className="text-gray-400">Compite semanalmente para subir de división.</p>
                    </div>

                    {/* League Tabs */}
                    <div className="flex justify-center gap-4 mb-12 overflow-x-auto pb-4">
                        {leagues.map((league) => (
                            <div key={league.name} className={`flex flex-col items-center gap-2 p-4 rounded-2xl min-w-[100px] transition-all cursor-pointer border ${league.active ? 'bg-slate-800 border-yellow-500 scale-110 shadow-lg shadow-yellow-900/20' : 'bg-slate-900 border-white/5 opacity-50 hover:opacity-100'}`}>
                                <div className="text-3xl">{league.icon}</div>
                                <span className={`font-bold text-sm ${league.active ? 'text-white' : 'text-gray-500'}`}>{league.name}</span>
                            </div>
                        ))}
                    </div>

                    {/* Leaderboard Card */}
                    <div className="bg-slate-800 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-6 border-b border-white/10 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-yellow-500 flex items-center gap-2">
                                    <Trophy size={24} /> Liga Oro
                                </h2>
                                <p className="text-sm text-gray-400">Termina en 2 días 14 horas</p>
                            </div>
                            <div className="px-4 py-2 bg-slate-900/50 rounded-lg text-sm text-yellow-200 border border-yellow-500/20">
                                Top 10 suben a Diamante 💎
                            </div>
                        </div>

                        <div className="divide-y divide-white/5">
                            {leaderboard.map((user) => (
                                <div key={user.rank} className={`flex items-center gap-4 p-4 hover:bg-white/5 transition-colors ${user.isMe ? 'bg-blue-600/10 border-l-4 border-blue-500' : ''}`}>
                                    <div className={`w-8 font-bold text-center ${user.rank <= 3 ? 'text-yellow-400 text-xl' : 'text-gray-500'}`}>
                                        {user.rank}
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xl border border-white/10">
                                        {user.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`font-bold ${user.isMe ? 'text-blue-400' : 'text-white'}`}>
                                            {user.name} {user.isMe && '(Tú)'}
                                        </h3>
                                        <p className="text-xs text-gray-500">{user.xp} XP esta semana</p>
                                    </div>
                                    <div className="text-right">
                                        {user.trend === 'up' && <ArrowUp size={16} className="text-green-500" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
