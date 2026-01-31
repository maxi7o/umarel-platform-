'use client';

import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
    // Sharing functionality (No generic phone number)
    const message = "Mirá esta plataforma para arreglar la casa, está muy buena: https://elentendido.ar";

    const handleClick = () => {
        // Using wa.me/?text= allows the user to select contacts to share with
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-6 right-4 lg:right-dynamic z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-2xl shadow-green-900/40 transition-all hover:scale-110 group animate-in fade-in zoom-in duration-500 delay-1000"
            aria-label="Compartir por WhatsApp"
            style={{
                // Clever trick to keep it inside or near the 600px container on desktop
                right: 'max(1rem, calc(50vw - 300px + 1rem))'
            }}
        >
            <MessageCircle className="w-8 h-8 text-white fill-white" />
            <span className="absolute right-full mr-3 bg-white text-slate-900 px-3 py-1 rounded-lg text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block">
                ¡Compartir!
            </span>
        </button>
    );
}
