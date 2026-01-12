'use client';

// Accordion import removed

export function FaqSection() {
    const faqs = [
        {
            q: "¿Qué es exactamente un Umarel?",
            a: "Es un término cariñoso para referirse a la persona que supervisa una obra. En nuestra plataforma, son expertos verificados (o IA) que aseguran que el trabajo se haga bien antes de pagar."
        },
        {
            q: "¿Cómo funciona el pago seguro (Escrow)?",
            a: "El dinero queda en una cuenta intermedia segura. No se libera hasta que el trabajo está terminado y aprobado. Es la mejor garantía para ambas partes."
        },
        {
            q: "¿Tiene costo usar la plataforma?",
            a: "Publicar es gratis. Solo cobramos una pequeña comisión al momento de contratar y pagar el servicio para cubrir los costos de verificación y seguro."
        },
        {
            q: "¿Operan en todo el país?",
            a: "Por ahora estamos enfocados en CABA y GBA, pero pronto llegaremos a las principales ciudades del interior."
        }
    ];

    return (
        <section id="faq" className="py-24 bg-stone-50">
            <div className="container mx-auto px-6 max-w-3xl">
                <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 font-outfit">Preguntas Frecuentes</h2>

                {/* Fallback to simple details/summary if accordion missing, 
            but usually accordion is standardized. I'll use simple details for robustness 
            if I suspect dependencies might fail, but checking ui folder showed 'accordion.tsx' was NOT in the list.
            Checking list_dir of components/ui again...
         */}
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <details key={i} className="group bg-white rounded-xl border border-stone-200 open:ring-1 ring-orange-100">
                            <summary className="flex cursor-pointer items-center justify-between p-6 font-medium text-slate-900 marker:content-none">
                                {faq.q}
                                <span className="transition group-open:rotate-180">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                                </span>
                            </summary>
                            <div className="px-6 pb-6 text-slate-500 leading-relaxed">
                                {faq.a}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
