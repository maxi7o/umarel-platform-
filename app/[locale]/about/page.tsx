import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sobre Umarel - Nuestra Historia',
    description: 'Cómo nació la red de confianza para reformas y servicios en Argentina.',
};

export default function AboutPage() {
    return (
        <div className="container mx-auto py-24 px-6 max-w-4xl">
            <h1 className="text-4xl font-bold font-outfit mb-8 text-slate-900">Sobre Nosotros</h1>

            <div className="prose prose-lg text-slate-700">
                <p className="lead text-xl text-stone-600 mb-8">
                    Umarel no es una empresa de Silicon Valley. Nació de ver a nuestros abuelos mirando obras,
                    con las manos atrás de la espalda, moviendo la cabeza cuando veían algo mal hecho.
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mt-12 mb-4">El Origen del Nombre</h2>
                <p>
                    "Umarell" es un término boloñés que se refiere a los jubilados que observan las obras de construcción.
                    En Argentina, tenemos nuestra propia versión: el vecino que sabe, el tío que arregla todo,
                    el profesional que ya vio mil reformas.
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mt-12 mb-4">Nuestra Misión</h2>
                <p>
                    Queremos que contratar un servicio deje de ser una lotería. Conectar la necesidad del que busca,
                    con la habilidad del que hace, y la sabiduría del que sabe mirar.
                </p>

                <div className="bg-blue-50 p-6 rounded-2xl mt-12 border border-blue-100">
                    <h3 className="text-blue-900 font-bold mb-2">¿Por qué confiar?</h3>
                    <p className="text-blue-800 m-0">
                        Usamos tecnología para proteger tu plata (Escrow), pero usamos personas reales para verificar la calidad.
                        Esa combinación es lo que nos hace únicos.
                    </p>
                </div>
            </div>
        </div>
    );
}
