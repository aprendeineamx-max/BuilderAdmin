"use client";

import { CheckCircle, ExternalLink, ShieldCheck, Box } from "lucide-react";

interface BlockchainVerifierProps {
    txHash: string;
    chainId: number;
    mintedAt: string;
}

export default function BlockchainVerifier({ txHash, chainId, mintedAt }: BlockchainVerifierProps) {
    const chainName = chainId === 137 ? "Polygon Mainnet" : chainId === 80002 ? "Polygon Amoy" : "Unknown Chain";
    const explorerUrl = chainId === 137
        ? `https://polygonscan.com/tx/${txHash}`
        : `https://amoy.polygonscan.com/tx/${txHash}`;

    return (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/30 backdrop-blur-sm mt-8">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                    <Box size={32} />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        Certificado Verificado en Blockchain <ShieldCheck className="text-green-500" size={20} />
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                        Este documento ha sido inmutabilizado criptográficamente. Su autenticidad puede ser verificada independientemente.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-slate-900/50 p-3 rounded-lg border border-white/5">
                            <span className="text-xs text-gray-500 uppercase font-bold">Red</span>
                            <div className="text-purple-300 font-mono text-sm">{chainName}</div>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-lg border border-white/5">
                            <span className="text-xs text-gray-500 uppercase font-bold">Fecha de Emisión</span>
                            <div className="text-gray-300 font-mono text-sm">{new Date(mintedAt).toLocaleDateString()}</div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <span className="text-xs text-gray-500 uppercase font-bold">Transaction Hash</span>
                        <a
                            href={explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-xs md:text-sm font-mono mt-1 break-all transition-colors"
                        >
                            {txHash} <ExternalLink size={14} />
                        </a>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                <CheckCircle size={14} className="text-green-500" />
                Verificación criptográfica provista por INEA Chain
            </div>
        </div>
    );
}
