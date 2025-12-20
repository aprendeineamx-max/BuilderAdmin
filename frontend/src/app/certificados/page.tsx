"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, Button, Skeleton } from "@/components/ui";
import Link from "next/link";
import { Award, Download, ExternalLink } from "lucide-react";

export default function CertificadosPage() {
    const [loading, setLoading] = useState(true);
    const [certificates, setCertificates] = useState<any[]>([]);

    useEffect(() => {
        const fetchCertificates = async () => {
            const { data } = await supabase.from('certificates').select('*').order('issued_at', { ascending: false });
            if (data) setCertificates(data);
            setLoading(false);
        };
        fetchCertificates();
    }, []);

    // Function to generate a dummy certificate for demo purposes
    const generateDemoCertificate = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return; // Should be handled by auth guard

        await supabase.from('certificates').insert({
            user_id: user.id,
            course_name: "Certificado de Primaria",
            course_slug: "primaria-completa"
        });

        // Refresh
        const { data } = await supabase.from('certificates').select('*').order('issued_at', { ascending: false });
        if (data) setCertificates(data);
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Mis Certificaciones</h1>
                    <p className="text-slate-400">Valida y descarga tus logros académicos.</p>
                </div>
                {certificates.length === 0 && (
                    <Button onClick={generateDemoCertificate} variant="primary">
                        Generar Demo
                    </Button>
                )}
            </div>

            {loading ? (
                <div className="grid gap-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            ) : (
                <div className="grid gap-6">
                    {certificates.length === 0 ? (
                        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-white/10">
                            <Award size={48} className="mx-auto text-slate-600 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Aún no tienes certificados</h3>
                            <p className="text-slate-400">Completa una Ruta de Aprendizaje para obtener tu primer diploma.</p>
                        </div>
                    ) : (
                        certificates.map((cert) => (
                            <CertificateCard key={cert.id} cert={cert} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

function CertificateCard({ cert }: { cert: any }) {
    return (
        <div className="bg-slate-900 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 hover:border-blue-500/50 transition-colors group">
            <div className="w-full md:w-1/4 aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
                <Award size={48} className="text-amber-400 relative z-10" />
            </div>

            <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-white mb-1">{cert.course_name}</h3>
                <p className="text-sm text-slate-400 mb-4">
                    Emitido el {new Date(cert.issued_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <code className="px-3 py-1 bg-black/30 rounded text-xs font-mono text-slate-500">
                        ID: {cert.validation_code}
                    </code>
                </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
                <Link href={`/certificado/${cert.id}`} className="w-full">
                    <Button variant="secondary" className="w-full justify-center">
                        <ExternalLink size={16} className="mr-2" />
                        Ver / Imprimir
                    </Button>
                </Link>
                {/* <Button variant="ghost" className="w-full justify-center text-slate-400 hover:text-white">
                    <Share2 size={16} className="mr-2" />
                    Compartir
                </Button> */}
            </div>
        </div>
    );
}
