import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shovel, MapPin, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BachesCampaignPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Hero Section */}
            <header className="bg-orange-500 text-white py-12 px-4 text-center">
                <div className="container mx-auto max-w-2xl">
                    <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                        <MapPin className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                        Vemos el problema. <br />
                        <span className="text-slate-900">Vos contratá la solución.</span>
                    </h1>
                    <p className="text-lg md:text-xl opacity-90 mb-8 max-w-lg mx-auto">
                        ¿Cansado de esperar? Los Umarels observan, pero vos podés actuar.
                        Encontrá la persona que lo arregle ahora.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="bg-slate-900 text-white hover:bg-slate-800 text-lg py-6 px-8 rounded-full shadow-xl">
                            <Link href="/create-request?category=repairs&description=Arreglo%20de%20Bache%20o%20Vereda">
                                <Shovel className="mr-2 h-5 w-5" />
                                Publicar Arreglo
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Visual / Context */}
            <section className="py-16 px-4 bg-white">
                <div className="container mx-auto max-w-4xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-orange-200 rounded-2xl transform rotate-3 transition-transform group-hover:rotate-6"></div>
                            <div className="relative bg-slate-100 rounded-2xl p-8 border-2 border-slate-200 aspect-[4/3] flex items-center justify-center overflow-hidden">
                                <div className="text-center space-y-2">
                                    <AlertTriangle className="h-16 w-16 text-orange-500 mx-auto" />
                                    <p className="font-mono text-sm text-slate-500">EVIDENCE #4829</p>
                                    <p className="font-bold text-slate-700">Bache detectado</p>
                                </div>
                                {/* Diagonal "Inspected" Tape */}
                                <div className="absolute top-6 -right-12 bg-orange-500 text-white text-xs font-bold py-1 px-12 transform rotate-45 shadow-sm">
                                    VALIDADO POR EXPERTO
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-slate-900">
                                No te quedes mirando.
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                En Buenos Aires, mirar una obra es deporte nacional. Pero arreglarla es otra historia.
                                Conectamos a los que tienen un problema con los que tienen las herramientas.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-green-100 p-1 rounded-full">
                                        <ArrowRight className="h-4 w-4 text-green-600" />
                                    </div>
                                    <p className="text-slate-700"><strong>Presupuestos rápidos:</strong> Subí la foto, recibí ofertas.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-green-100 p-1 rounded-full">
                                        <ArrowRight className="h-4 w-4 text-green-600" />
                                    </div>
                                    <p className="text-slate-700"><strong>Gente confiable:</strong> Identidad verificada y reputación real.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-green-100 p-1 rounded-full">
                                        <ArrowRight className="h-4 w-4 text-green-600" />
                                    </div>
                                    <p className="text-slate-700"><strong>Pago seguro:</strong> Tu plata se libera cuando el bache desaparece.</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof Bar */}
            <section className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm uppercase tracking-widest font-semibold mb-4">Impacto Hoy</p>
                    <div className="flex justify-center gap-12 text-center">
                        <div>
                            <p className="text-3xl font-bold text-white">500+</p>
                            <p className="text-xs">Baches Observados</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">120</p>
                            <p className="text-xs">Obras en Curso</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">24h</p>
                            <p className="text-xs">Tiempo Promedio</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
