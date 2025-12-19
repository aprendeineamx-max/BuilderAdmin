export default function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
            <div className="text-center">
                <div className="relative">
                    {/* Animated logo */}
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center animate-pulse mx-auto">
                        <span className="text-white font-bold text-4xl">I</span>
                    </div>
                    {/* Loading spinner around logo */}
                    <div className="absolute inset-0 w-24 h-24 -top-2 -left-2 border-4 border-transparent border-t-blue-500 border-r-emerald-400 rounded-full animate-spin mx-auto"></div>
                </div>
                <p className="text-gray-400 mt-6 animate-pulse">Cargando...</p>
            </div>
        </div>
    );
}
