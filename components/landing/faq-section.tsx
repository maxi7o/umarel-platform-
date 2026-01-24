'use client';

// Accordion import removed

export function FaqSection() {
    const faqs = [
        {
            q: "¿Qué es un Entendido?",
            a: "Es un experto verificado que revisa presupuestos y fotos de obra para asegurar que el trabajo se haga bien y a precio justo. Ganan un porcentaje por cada proyecto que ayudan a validar."
        },
        {
            q: "¿Cómo funciona el pago seguro?",
            a: "Tu dinero queda protegido en Mercado Pago. Solo se libera al profesional cuando aprobás cada etapa del proyecto. Pagás contra avance real de obra."
        },
        {
            q: "¿Tiene costo usar la plataforma?",
            a: "Publicar proyectos es gratis. Solo cobramos una comisión del 15% al momento de contratar, que ya está incluida en los montos que ves. Esto cubre la verificación, el pago seguro y la validación por Entendidos."
        },
        {
            q: "¿Operan en todo el país?",
            a: "Por ahora estamos enfocados en CABA y GBA. Pronto llegaremos a las principales ciudades del interior."
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
