'use client';

import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
    const phoneNumber = "5491112345678"; // Dummy Argentina number
    const message = "Hola Umarel! Quiero saber más.";

    const handleClick = () => {
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-2xl shadow-green-900/40 transition-all hover:scale-110 group animate-in fade-in zoom-in duration-500 delay-1000"
            aria-label="Contactar por WhatsApp"
        >
            <MessageCircle className="w-8 h-8 text-white fill-white" />
            <span className="absolute right-full mr-4 bg-white text-slate-900 px-3 py-1 rounded-lg text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                ¡Hablemos!
            </span>
        </button>
    );
}
