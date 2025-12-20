"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Badge } from "./ui";

export default function BadgeNotification({ title, message, trigger }: { title: string, message: string, trigger: boolean }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (trigger) {
            setVisible(true);
            triggerConfetti();
            const timer = setTimeout(() => setVisible(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [trigger]);

    const triggerConfetti = () => {
        const count = 200;
        const defaults = {
            origin: { y: 0.7 }
        };

        function fire(particleRatio: number, opts: any) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio)
            });
        }

        fire(0.25, {
            spread: 26,
            startVelocity: 55,
        });
        fire(0.2, {
            spread: 60,
        });
        fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 45,
        });
    };

    if (!visible) return null;

    return (
        <div className="fixed top-24 right-4 z-[60] animate-slide-in-right">
            <div className="bg-slate-900 border border-yellow-500/50 rounded-xl p-4 shadow-2xl shadow-yellow-500/20 flex gap-4 max-w-sm">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center text-2xl animate-bounce">
                    🏆
                </div>
                <div>
                    <h4 className="font-bold text-white text-lg">{title}</h4>
                    <p className="text-sm text-yellow-100/80">{message}</p>
                </div>
            </div>
        </div>
    );
}
