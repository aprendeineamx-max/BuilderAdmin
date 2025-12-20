"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button, Input } from '@/components/ui';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';

export default function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [msg, setMsg] = useState("");

    const subscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');

        try {
            const { error } = await supabase
                .from('subscribers')
                .insert({ email, source: 'blog_footer' });

            if (error) {
                if (error.code === '23505') { // Unique violation
                    setStatus('success');
                    setMsg("¡Ya estabas suscrito! Gracias de nuevo.");
                } else {
                    throw error;
                }
            } else {
                setStatus('success');
                setMsg("¡Gracias por suscribirte! Recibirás noticias pronto.");
                setEmail("");
            }
        } catch (err) {
            console.error(err);
            setStatus('error');
            setMsg("Hubo un error. Intenta más tarde.");
        }
    };

    if (status === 'success') {
        return (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center animate-fade-in">
                <div className="flex justify-center mb-3">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-green-600 mb-2">¡Suscripción Exitosa!</h3>
                <p className="text-green-700/80">{msg}</p>
                <button
                    onClick={() => setStatus('idle')}
                    className="mt-4 text-sm text-green-600 underline"
                >
                    Suscribir otro correo
                </button>
            </div>
        );
    }

    return (
        <div className="bg-indigo-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10">
                <Mail className="w-64 h-64" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">
                    📬 No te pierdas ninguna clase
                </h2>
                <p className="text-indigo-200 mb-8 text-lg">
                    Recibe guías de estudio, tips para exámenes y noticias de INEA.mx directamente en tu correo. Es gratis.
                </p>

                <form onSubmit={subscribe} className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                    <div className="flex-1">
                        <input
                            type="email"
                            placeholder="tu@correo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <Button
                        variant="primary"
                        size="md" // Assuming 'md' maps to default or similar
                        disabled={status === 'loading'}
                        className="bg-indigo-500 hover:bg-indigo-400 border-none px-6"
                    >
                        {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : "Suscribirme"}
                    </Button>
                </form>

                {status === 'error' && (
                    <p className="mt-4 text-red-300 text-sm">{msg}</p>
                )}

                <p className="mt-6 text-indigo-300/60 text-xs">
                    Respetamos tu privacidad. Sin spam.
                </p>
            </div>
        </div>
    );
}
