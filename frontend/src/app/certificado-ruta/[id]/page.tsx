import { createClient } from "@supabase/supabase-js";
import { Metadata } from "next";
import Link from "next/link";
import { Award, CheckCircle, Calendar, Shield } from "lucide-react";
import BlockchainVerifier from "@/components/BlockchainVerifier";
import PrintButton from "@/components/PrintButton";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    return {
        title: `Certificado de Ruta - INEA.mx`,
        description: `Certificado oficial de completitud de ruta de aprendizaje.`,
    };
}

export default async function PathCertificatePage({ params }: { params: { id: string } }) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: cert } = await supabase
        .from('path_certificates')
        .select('*, profiles(full_name)')
        .eq('id', params.id)
        .single();

    if (!cert) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Certificado no encontrado</h1>
                    <Link href="/certificados" className="text-blue-400 hover:underline">
                        Ver mis certificados
                    </Link>
                </div>
            </div>
        );
    }

    const userName = cert.profiles?.full_name || "Estudiante";
    const date = new Date(cert.issued_at).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-neutral-900 to-blue-900 flex flex-col items-center justify-center p-4">
            <style>{`
                @media print {
                    @page { size: landscape; margin: 0; }
                    body { background: white; -webkit-print-color-adjust: exact; }
                    .no-print { display: none !important; }
                    .print-container { 
                        box-shadow: none !important; 
                        width: 100vw !important;
                        height: 100vh !important;
                        max-width: none !important;
                    }
                }
            `}</style>

            <div className="max-w-5xl w-full aspect-[1.414/1] bg-gradient-to-br from-white to-purple-50 text-black relative print-container shadow-2xl overflow-hidden flex flex-col items-center justify-center text-center p-12 md:p-24">

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500"></div>
                <div className="absolute inset-4 border-4 border-double border-purple-300 opacity-30 pointer-events-none rounded-lg"></div>

                {/* Badge */}
                <div className="absolute top-8 right-8 bg-purple-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                    <Award size={20} />
                    <span className="font-bold text-sm">RUTA COMPLETADA</span>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-purple-900 mb-4 tracking-tight">INEA.mx</h1>
                    <p className="text-xl uppercase tracking-[0.3em] text-purple-600">Instituto Nacional para la Educación de los Adultos</p>
                </div>

                {/* Body */}
                <div className="space-y-6 max-w-3xl z-10">
                    <p className="text-2xl text-purple-700 font-serif italic">Certifica que</p>

                    <h3 className="text-5xl font-script text-purple-900 font-bold mb-6 border-b-4 border-purple-200 pb-4">
                        {userName}
                    </h3>

                    <p className="text-xl text-gray-700 leading-relaxed">
                        Ha completado exitosamente todos los módulos y requisitos de la ruta de aprendizaje:
                    </p>

                    <h4 className="text-4xl font-bold text-purple-900 mb-6 flex items-center justify-center gap-3">
                        <CheckCircle className="text-green-500" size={36} />
                        {cert.ruta_name}
                    </h4>

                    <p className="text-sm text-gray-500 italic">
                        Demostrando dedicación, esfuerzo y dominio de las competencias establecidas en el programa educativo.
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-auto w-full flex justify-between items-end px-12 pt-8">
                    <div className="text-left">
                        <div className="flex items-center gap-2 text-purple-600 mb-1">
                            <Calendar size={16} />
                            <p className="text-sm uppercase tracking-widest font-bold">Fecha de Emisión</p>
                        </div>
                        <p className="text-lg font-bold text-purple-900">{date}</p>
                    </div>

                    <div className="text-center">
                        <div className="w-48 border-b-2 border-purple-400 mb-2"></div>
                        <p className="text-sm font-bold text-purple-900">Director Académico</p>
                    </div>

                    <div className="text-right">
                        <div className="flex items-center justify-end gap-2 text-purple-600 mb-1">
                            <Shield size={16} />
                            <p className="text-sm uppercase tracking-widest font-bold">Código de Validación</p>
                        </div>
                        <p className="font-mono text-lg font-bold text-purple-900">{cert.validation_code}</p>
                    </div>
                </div>

                {/* Seal */}
                <div className="absolute bottom-8 left-8 w-24 h-24 opacity-20">
                    <div className="w-full h-full rounded-full border-8 border-purple-500 flex items-center justify-center">
                        <Award className="text-purple-500" size={48} />
                    </div>
                </div>
            </div>

            {/* Blockchain Verification (if applicable) */}
            {cert.blockchain_tx_hash && (
                <div className="max-w-5xl w-full no-print mt-6">
                    <BlockchainVerifier
                        txHash={cert.blockchain_tx_hash}
                        chainId={cert.chain_id}
                        mintedAt={cert.minted_at}
                    />
                </div>
            )}

            {/* Action Buttons */}
            <div className="fixed bottom-8 right-8 no-print flex gap-4">
                <Link
                    href="/certificados"
                    className="bg-purple-800 text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple-700 transition"
                >
                    Volver
                </Link>
                <PrintButton />
            </div>
        </div>
    );
}
