import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sobre El Entendido - Nuestra Historia',
    description: 'Cómo nació la ingeniería de confianza para reformas y servicios en Argentina.',
};

export default function AboutPage() {
    return (
        <div className="container mx-auto py-24 px-6 max-w-4xl">
            <h1 className="text-4xl font-bold font-outfit mb-8 text-slate-900">Sobre Nosotros</h1>

            <div className="prose prose-lg text-slate-700">
                <p className="lead text-xl text-slate-600 mb-8">
                    El Entendido nació de una frustración compartida: la incertidumbre al contratar servicios y la desprotección al ofrecerlos.
                    En un mercado donde "la palabra" ya no alcanza, decidimos construir un sistema donde la confianza no se pide, se demuestra.
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mt-12 mb-4">El Concepto</h2>
                <p>
                    "El Entendido" no es una persona, es un estándar. Representa la visión experta que valida la calidad.
                    Ya sea un arquitecto, un ingeniero o un especialista con años de oficio, es la figura que asegura que lo pactado se cumpla.
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mt-12 mb-4">Nuestra Misión</h2>
                <p>
                    Queremos que contratar un servicio deje de ser una lotería. Conectar la necesidad del que busca,
                    con la habilidad del que hace, y la garantía del que sabe validar.
                    Transformamos "presupuestos en el aire" en **hitos cumplibles y verificables**.
                </p>

                <div className="bg-blue-50 p-6 rounded-2xl mt-12 border border-blue-100">
                    <h3 className="text-blue-900 font-bold mb-2">Ingeniería de Confianza</h3>
                    <p className="text-blue-800 m-0">
                        Usamos tecnología para custodiar los fondos (Escrow) y expertos reales para auditar la ejecución.
                        Esa combinación elimina el riesgo para ambas partes.
                    </p>
                </div>
            </div>
        </div>
    );
}
