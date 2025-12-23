"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShoppingBag, Coins, Zap, User, Palette } from "lucide-react";

export default function ShopPage() {
    const categories = [
        { id: 'powerup', name: 'Potenciadores', icon: Zap },
        { id: 'avatar', name: 'Avatares', icon: User },
        { id: 'theme', name: 'Temas', icon: Palette },
    ];

    const items = [
        { id: 1, name: 'Racha Congelada', desc: 'Protege tu racha por un día.', price: 200, icon: '❄️', category: 'powerup' },
        { id: 2, name: 'Doble XP', desc: 'Gana doble experiencia por 30 min.', price: 150, icon: '🧪', category: 'powerup' },
        { id: 3, name: 'Traje Espacial', desc: 'Avatar exclusivo de astronauta.', price: 1000, icon: '👨‍🚀', category: 'avatar' },
        { id: 4, name: 'Rey del Saber', desc: 'Corona dorada para tu avatar.', price: 5000, icon: '👑', category: 'avatar' },
        { id: 5, name: 'Modo Oscuro Neón', desc: 'Tema cyberpunk para tu perfil.', price: 500, icon: '🌆', category: 'theme' },
        { id: 6, name: 'Fondo de Bosque', desc: 'Tema relajante natural.', price: 300, icon: '🌲', category: 'theme' },
    ];

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            <Navbar />

            <main className="flex-1 pt-24 pb-12 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header with Balance */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12 bg-slate-800/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
                        <div>
                            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
                                Tienda de Recompensas
                            </h1>
                            <p className="text-gray-400">Canjea tus monedas por ítems exclusivos.</p>
                        </div>
                        <div className="flex items-center gap-4 mt-6 md:mt-0 bg-slate-900/80 px-6 py-3 rounded-full border border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                            <Coins className="text-yellow-400" size={32} />
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Tu Balance</span>
                                <span className="text-2xl font-bold text-white">1,250 XP</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar Filters */}
                        <aside className="space-y-4">
                            <h3 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-2">Categorías</h3>
                            {categories.map(cat => (
                                <button key={cat.id} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors text-left border border-white/5">
                                    <cat.icon size={20} className="text-blue-400" />
                                    <span className="font-medium">{cat.name}</span>
                                </button>
                            ))}
                        </aside>

                        {/* Items Grid */}
                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items.map(item => (
                                <div key={item.id} className="bg-slate-800 rounded-2xl p-6 border border-white/5 hover:border-yellow-500/50 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-900/10 group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <ShoppingBag size={100} />
                                    </div>

                                    <div className="text-6xl mb-6 text-center animate-bounce-slow">{item.icon}</div>

                                    <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                                    <p className="text-sm text-gray-400 mb-6 h-10">{item.desc}</p>

                                    <button className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-slate-900 font-bold flex items-center justify-center gap-2 transition-transform active:scale-95">
                                        <Coins size={18} />
                                        {item.price}
                                    </button>
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
