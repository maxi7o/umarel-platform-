import React from 'react';
import { Lightbulb, Rocket } from 'lucide-react';

export default function ConstructionPage() {
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700 max-w-md w-full">
                <div className="flex justify-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        <Lightbulb className="w-8 h-8 text-slate-900" />
                    </div>
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <Rocket className="w-8 h-8 text-white" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-white mb-4 font-outfit">
                    Umarel.org
                </h1>
                <div className="w-16 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 mx-auto mb-6 rounded-full"></div>

                <p className="text-xl text-slate-300 mb-2">
                    Sitio en Desarrollo
                </p>
                <p className="text-slate-500 text-sm mb-8">
                    Estamos construyendo el futuro.
                </p>

                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                    <p className="text-slate-400 text-sm">
                        ¿Buscás la plataforma activa?
                    </p>
                    <a
                        href="https://elentendido.ar"
                        className="block mt-3 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-blue-900/20"
                    >
                        Ir a ElEntendido.ar
                    </a>
                </div>
            </div>

            <p className="mt-12 text-slate-600 text-xs uppercase tracking-widest">
                Umarel Inc. &copy; 2026
            </p>
        </div>
    );
}
