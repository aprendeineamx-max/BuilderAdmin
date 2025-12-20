"use client";

import { useState } from "react";
import { Button, Card, Badge, Avatar } from "@/components/ui";
import { Plus, Mail, Shield, Trash2, Search } from "lucide-react";

export default function OrgMembersPage() {
    // Mock Data
    const [members, setMembers] = useState([
        { id: 1, name: "Ana Garcia", email: "ana.garcia@techcorp.mx", role: "admin", status: "active", last_active: "Hace 2 min" },
        { id: 2, name: "Carlos Ruiz", email: "carlos.ruiz@techcorp.mx", role: "member", status: "active", last_active: "Hace 1 hora" },
        { id: 3, name: "Maria Lopez", email: "maria.lopez@techcorp.mx", role: "member", status: "active", last_active: "Hace 3 días" },
        { id: 4, name: "Juan Perez", email: "juan.perez@techcorp.mx", role: "member", status: "invited", last_active: "-" },
    ]);

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Colaboradores</h1>
                    <p className="text-slate-400">Gestiona el acceso y roles de tu equipo.</p>
                </div>
                <Button variant="primary" className="flex items-center gap-2">
                    <Plus size={18} />
                    <span>Invitar Miembro</span>
                </Button>
            </header>

            <Card className="p-0 overflow-hidden border-none bg-slate-900/50">
                {/* Toolbar */}
                <div className="p-4 border-b border-white/10 flex gap-4 bg-slate-800/20">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o correo..."
                            className="w-full bg-slate-900 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-4 font-medium">Usuario</th>
                                <th className="p-4 font-medium">Rol</th>
                                <th className="p-4 font-medium">Estado</th>
                                <th className="p-4 font-medium">Última Actividad</th>
                                <th className="p-4 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {members.map((member) => (
                                <tr key={member.id} className="hover:bg-white/5 transition group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar name={member.name} size="sm" />
                                            <div>
                                                <div className="font-medium text-white">{member.name}</div>
                                                <div className="text-xs text-slate-400">{member.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {member.role === 'admin' && <Shield size={14} className="text-amber-400" />}
                                            <span className={`text-sm capitalize ${member.role === 'admin' ? 'text-amber-400 font-medium' : 'text-slate-300'}`}>
                                                {member.role}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <Badge variant={member.status === 'active' ? 'success' : 'warning'}>
                                            {member.status === 'active' ? 'Activo' : 'Invitado'}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-sm text-slate-400">
                                        {member.last_active}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition opacity-0 group-hover:opacity-100">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-white/10 flex justify-between items-center text-xs text-slate-500 bg-slate-800/20">
                    <span>Mostrando 4 de 24 miembros</span>
                    <div className="flex gap-2">
                        <button disabled className="px-3 py-1 bg-white/5 rounded border border-white/10 disabled:opacity-50">Anterior</button>
                        <button className="px-3 py-1 bg-white/5 rounded border border-white/10 hover:bg-white/10 hover:text-white transition">Siguiente</button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
