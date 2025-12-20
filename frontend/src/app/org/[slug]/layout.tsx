"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { BarChart3, Users, Settings, LogOut, Building, FileBarChart } from "lucide-react";

export default function OrgLayout({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const pathname = usePathname();
    const slug = params.slug;

    return (
        <div className="min-h-screen bg-slate-900 flex text-gray-100">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-slate-900 flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-white/10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Building className="text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-sm text-white">Tech Corp</h2>
                        <p className="text-xs text-slate-400">Enterprise Plan</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavItem
                        href={`/org/${slug}`}
                        active={pathname === `/org/${slug}`}
                        icon={<BarChart3 />}
                        label="Dashboard"
                    />
                    <NavItem
                        href={`/org/${slug}/members`}
                        active={pathname === `/org/${slug}/members`}
                        icon={<Users />}
                        label="Colaboradores"
                    />
                    <NavItem
                        href={`/org/${slug}/reports`}
                        active={pathname === `/org/${slug}/reports`}
                        icon={<FileBarChart />}
                        label="Reportes"
                    />
                    <NavItem
                        href={`/org/${slug}/settings`}
                        active={pathname === `/org/${slug}/settings`}
                        icon={<Settings />}
                        label="Configuración"
                    />
                </nav>

                <div className="p-4 border-t border-white/10">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition rounded-lg hover:bg-white/5">
                        <LogOut size={20} />
                        <span>Volver al Inicio</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}

function NavItem({ href, active, icon, label }: { href: string, active: boolean, icon: any, label: string }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active
                    ? "bg-blue-600/10 text-blue-400 border border-blue-600/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
        >
            <div className="w-5 h-5">{icon}</div>
            <span className="font-medium">{label}</span>
        </Link>
    );
}
