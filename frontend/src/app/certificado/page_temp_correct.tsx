import { createClient } from "@supabase/supabase-js";
import { Metadata } from "next";
import Link from "next/link";
import BlockchainVerifier from "@/components/BlockchainVerifier";
import PrintButton from "@/components/PrintButton";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    return {
        title: `Certificado Oficial - INEA.mx`,
        description: `Verificación de certificado académico.`,
    };
}

export default async function CertificateViewPage({ params }: { params: { id: string } }) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: cert } = await supabase.from('certificates').select('*, profiles(full_name)').eq('id', params.id).single();

    if (!cert) {
        return <div className="min-h-screen flex items-center justify-center text-white">Certificado no encontrado.</div>;
    }

    const userName = cert.profiles?.full_name || "Estudiante";
    const date = new Date(cert.issued_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4">
            <style>{`
                @media print {
                    @page { size: landscape; margin: 0; }
                    body { background: white; -webkit-print-color-adjust: exact; }
                    .no-print { display: none !important; }
                    .print-container { 
                        box-shadow: none !important; 
                        border: 10px solid #111 !important;
                        width: 100vw !important;
                        height: 100vh !important;
                        max-width: none !important;
                    }
                    .text-slate-400 { color: #666 !important; }
                    .text-white { color: #000 !important; }
                    .bg-neutral-900 { background: white !important; }
                }
            `}</style>

            <div className="max-w-5xl w-full aspect-[1.414/1] bg-white text-black relative print-container shadow-2xl overflow-hidden flex flex-col items-center justify-center text-center p-12 md:p-24 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                <div className="absolute inset-4 border-4 border-double border-slate-800 opacity-20 pointer-events-none"></div>

                <div className="mb-12">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-4 tracking-tighter">INEA.mx</h1>
                    <p className="text-xl uppercase tracking-[0.2em] text-slate-500">Instituto Nacional para la Educación de los Adultos</p>
                </div>

                <div className="space-y-6 max-w-3xl z-10">
                    <p className="text-2xl text-slate-600 font-serif italic">Otorga el presente</p>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 uppercase tracking-wide border-b-2 border-slate-300 pb-6 inline-block w-full">
                        Certificado de Reconocimiento
                    </h2>
                    <p className="text-2xl text-slate-600 font-serif italic">a</p>
                    <h3 className="text-4xl md:text-5xl font-script text-blue-900 font-bold mb-8">{userName}</h3>

                    <p className="text-xl text-slate-700 leading-relaxed">
                        Por haber completado satisfactoriamente los requisitos académicos del programa:
                    </p>
                    <h4 className="text-3xl font-bold text-slate-900 mb-8">{cert.course_name}</h4>
                </div>

                <div className="mt-16 w-full flex justify-between items-end px-12">
                    <div className="text-left">
                        <p className="text-sm text-slate-400 uppercase tracking-widest mb-1">Fecha de Emisión</p>
                        <p className="text-lg font-bold text-slate-900">{date}</p>
                    </div>

                    <div className="text-center">
                        <div className="w-48 border-b border-slate-400 mb-2"></div>
                        <p className="text-sm font-bold text-slate-900">Director Académico</p>
                    </div>

                    <div className="text-right">
                        <p className="text-sm text-slate-400 uppercase tracking-widest mb-1">ID de Validación</p>
                        <p className="font-mono text-lg font-bold text-slate-900">{cert.validation_code}</p>
                    </div>
                </div>

                <div className="absolute bottom-12 right-12 w-32 h-32 opacity-10">
                    <div className="w-full h-full rounded-full border-4 border-slate-900 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full border border-slate-900"></div>
                    </div>
                </div>
            </div>

            {cert.blockchain_tx_hash && (
                <div className="max-w-5xl w-full no-print">
                    <BlockchainVerifier
                        txHash={cert.blockchain_tx_hash}
                        chainId={cert.chain_id}
                        mintedAt={cert.minted_at}
                    />
                </div>
            )}

            <div className="fixed bottom-8 right-8 no-print flex gap-4">
                <Link href="/certificados" className="bg-slate-800 text-white px-6 py-3 rounded-full shadow-lg hover:bg-slate-700 transition">
                    Volver
                </Link>
                <PrintButton />
            </div>
        </div>
    );
}
