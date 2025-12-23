"use client";

import { Download } from "lucide-react";

export default function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-500 transition flex items-center gap-2 font-bold"
        >
            <Download size={20} />
            Descargar PDF
        </button>
    );
}
