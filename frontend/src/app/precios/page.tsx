"use client";

import { useEffect, useState } from "react";
import { Button, Card, Badge } from "@/components/ui";
import { Check, X, CreditCard, Star, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
// import { toast } from "@/components/ui/use-toast"; // Assuming toast exists or using alert for now

export default function PricingPage() {
    const [plans, setPlans] = useState<any[]>([]);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchPlans = async () => {
            const { data } = await supabase.from('plans').select('*').in('id', ['free', 'pro_monthly', 'pro_yearly', 'enterprise']).order('price');
            if (data) setPlans(data);
            setLoading(false);
        };
        fetchPlans();
    }, []);

    const handleSubscribe = async (plan: any) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/login?next=/precios');
            return;
        }

        if (plan.id === 'enterprise') {
            router.push('/empresas');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: plan.price === 199 ? 'price_monthly_id' : 'price_yearly_id', // Needs Env Var or DB lookup
                    userId: user.id,
                    email: user.email
                })
            });

            if (!response.ok) throw new Error("Error creating session");

            const { url } = await response.json();
            window.location.href = url; // Redirect to Stripe
        } catch (error) {
            alert("Error al iniciar pago. Intenta de nuevo.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-7xl mx-auto space-y-12 text-center">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                        Invierte en tu <span className="text-blue-500">Futuro</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Planes flexibles para estudiantes autodidactas, escuelas y empresas.
                        Comienza gratis y mejora cuando estés listo.
                    </p>
                </div>

                {/* Billing Toggle */}
                <div className="flex justify-center items-center gap-4">
                    <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Mensual</span>
                    <button
                        onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                        className="w-14 h-8 bg-blue-600 rounded-full relative transition-colors focus:outline-none"
                    >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${billingCycle === 'yearly' ? 'left-7' : 'left-1'}`}></div>
                    </button>
                    <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'}`}>Anual <Badge variant="success" className="ml-2 text-[10px]">Ahorra 20%</Badge></span>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    {/* Free Plan */}
                    <PricingCard
                        name="Gratuito"
                        price={0}
                        description="Para empezar a aprender hoy mismo."
                        features={[
                            "Acceso a cursos básicos",
                            "Publicidad limitada",
                            "Certificados con marca de agua",
                            "Comunidad de estudiantes"
                        ]}
                        buttonText="Tu Plan Actual"
                        buttonVariant="outline"
                        onClick={() => { }}
                        disabled={true}
                    />

                    {/* Pro Plan */}
                    <PricingCard
                        name="Pro Estudiante"
                        price={billingCycle === 'monthly' ? 199 : 159} // Discounted visual
                        period={billingCycle === 'monthly' ? '/mes' : '/mes (facturado anual)'}
                        description="Acelera tu aprendizaje con IA y sin límites."
                        features={[
                            "Todo lo del plan Gratis",
                            "Sin publicidad",
                            "Tutor IA ilimitado (Llama 3 70B)",
                            "Certificados Oficiales PDF",
                            "Descarga de clases offline"
                        ]}
                        buttonText="Obtener Pro"
                        buttonVariant="primary"
                        highlight={true}
                        onClick={() => handleSubscribe({ id: 'pro', name: 'Pro', price: billingCycle === 'monthly' ? 199 : 1990 })}
                    />

                    {/* Enterprise Plan */}
                    <PricingCard
                        name="Empresas"
                        price="Variable"
                        description="Para escuelas y organizaciones que buscan escalar."
                        features={[
                            "Todo lo del plan Pro",
                            "Panel Administrativo",
                            "Gestión de Licencias",
                            "Reportes de Progreso",
                            "Soporte Prioritario",
                            "Facturación Fiscal (CFDI)"
                        ]}
                        buttonText="Contactar Ventas"
                        buttonVariant="outline"
                        onClick={() => router.push('/empresas')}
                    />
                </div>

                <div className="mt-16 pt-16 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <Feature icon={<CreditCard />} title="Pago Seguro" desc="Procesado por Stripe" />
                    <Feature icon={<Check />} title="Cancela cuando quieras" desc="Sin plazos forzosos" />
                    <Feature icon={<Star />} title="Garantía de 7 días" desc="O te devolvemos tu dinero" />
                    <Feature icon={<Zap />} title="Acceso Inmediato" desc="Empieza al instante" />
                </div>
            </div>
        </div>
    );
}

function PricingCard({ name, price, period, description, features, buttonText, buttonVariant, highlight, onClick, disabled }: any) {
    return (
        <Card className={`relative flex flex-col p-8 ${highlight ? 'border-blue-500 bg-slate-900/80 shadow-2xl shadow-blue-900/20' : 'bg-slate-900/50 border-white/10'}`}>
            {highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Más Popular
                </div>
            )}
            <div className="mb-6">
                <h3 className="text-xl font-bold text-white">{name}</h3>
                <p className="text-sm text-slate-400 mt-2">{description}</p>
            </div>
            <div className="mb-6">
                <div className="flex items-baseline">
                    <span className="text-4xl font-black text-white">{typeof price === 'number' ? `$${price}` : price}</span>
                    {typeof price === 'number' && <span className="text-slate-500 ml-2">{period}</span>}
                </div>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
                {features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                        <Check className="text-blue-500 shrink-0" size={18} />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            <Button
                variant={buttonVariant}
                className={`w-full py-4 text-base ${highlight ? 'shadow-lg shadow-blue-600/20' : ''}`}
                onClick={onClick}
                disabled={disabled}
            >
                {buttonText}
            </Button>
        </Card>
    );
}

function Feature({ icon, title, desc }: any) {
    return (
        <div className="flex flex-col items-center">
            <div className="p-3 bg-white/5 rounded-full mb-3 text-blue-400">
                {icon}
            </div>
            <h4 className="font-bold text-white text-sm">{title}</h4>
            <p className="text-xs text-slate-500">{desc}</p>
        </div>
    );
}
