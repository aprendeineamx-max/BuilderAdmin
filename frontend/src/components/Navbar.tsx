"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface NavItem {
    label: string;
    href: string;
    icon: string;
}

const navItems: NavItem[] = [
    { label: "Inicio", href: "/", icon: "🏠" },
    { label: "Cursos", href: "/cursos", icon: "📚" },
    { label: "Comunidad", href: "/comunidad", icon: "🌍" },
    { label: "Dashboard", href: "/dashboard", icon: "📊" },
    { label: "Chat Tutor", href: "/chat", icon: "🤖" },
    { label: "Perfil", href: "/perfil", icon: "👤" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        checkLiveStatus();

        // Subscribe to status changes
        const sub = supabase
            .channel('navbar-live-status')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
                checkLiveStatus();
            })
            .subscribe();

        return () => { supabase.removeChannel(sub); };
    }, []);

    const checkLiveStatus = async () => {
        const { data } = await supabase
            .from('events')
            .select('id')
            .eq('status', 'live')
            .maybeSingle();
        setIsLive(!!data);
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center">
                            <span className="text-white font-bold text-xl">I</span>
                        </div>
                        <span className="text-white font-bold text-xl hidden sm:block">INEA.mx</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${pathname === item.href
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "text-gray-300 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                        {isLive && (
                            <Link href="/live" className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse font-bold hover:bg-red-500/20 transition-colors">
                                <span>🔴</span>
                                <span>EN VIVO</span>
                            </Link>
                        )}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                            Iniciar Sesión
                        </Link>
                        <Link
                            href="/register"
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-lg font-medium hover:opacity-90"
                        >
                            Registrarse
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-gray-300 hover:text-white"
                    >
                        {isMenuOpen ? "✕" : "☰"}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-white/10">
                        <div className="flex flex-col gap-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-lg ${pathname === item.href
                                        ? "bg-blue-500/20 text-blue-400"
                                        : "text-gray-300 hover:bg-white/10"
                                        }`}
                                >
                                    <span>{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                            {isLive && (
                                <Link
                                    href="/live"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 font-bold hover:bg-red-500/20"
                                >
                                    <span>🔴</span>
                                    <span>EN VIVO</span>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
