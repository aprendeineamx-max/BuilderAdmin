"use client";

import { useState, useEffect } from "react";

interface Toast {
    id: number;
    message: string;
    type: "success" | "error" | "info";
}

export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (message: string, type: Toast["type"] = "info") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    };

    return { toasts, addToast };
}

export function ToastContainer({ toasts }: { toasts: Toast[] }) {
    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-slide-in ${toast.type === "success"
                            ? "bg-emerald-500 text-white"
                            : toast.type === "error"
                                ? "bg-red-500 text-white"
                                : "bg-blue-500 text-white"
                        }`}
                >
                    <span>
                        {toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}
                    </span>
                    <span>{toast.message}</span>
                </div>
            ))}
        </div>
    );
}

export function ProgressBar({ value, max = 100 }: { value: number; max?: number }) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}

export function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "warning" | "error" }) {
    const colors = {
        default: "bg-slate-500/20 text-slate-400",
        success: "bg-emerald-500/20 text-emerald-400",
        warning: "bg-amber-500/20 text-amber-400",
        error: "bg-red-500/20 text-red-400",
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[variant]}`}>
            {children}
        </span>
    );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-white/5 rounded-2xl border border-white/10 p-6 ${className}`}>
            {children}
        </div>
    );
}

export function Button({
    children,
    variant = "primary",
    size = "md",
    disabled = false,
    onClick,
    className = ""
}: {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
}) {
    const variants = {
        primary: "bg-gradient-to-r from-blue-500 to-emerald-400 text-white hover:opacity-90",
        secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/20",
        ghost: "text-gray-300 hover:text-white hover:bg-white/10",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2",
        lg: "px-6 py-3 text-lg",
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {children}
        </button>
    );
}

export function Skeleton({ className = "" }: { className?: string }) {
    return (
        <div className={`bg-slate-700 animate-pulse rounded ${className}`} />
    );
}

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
    const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

    const sizes = {
        sm: "w-8 h-8 text-sm",
        md: "w-10 h-10 text-base",
        lg: "w-16 h-16 text-2xl",
    };

    return (
        <div className={`rounded-full bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center text-white font-bold ${sizes[size]}`}>
            {initials}
        </div>
    );
}
