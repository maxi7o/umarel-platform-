import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Briefcase, Ticket, ArrowRight, HardHat, Sparkles } from "lucide-react"

export default function QuotePage() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-5xl">
            <div className="text-center mb-12 space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900">¿Qué te gustaría cotizar?</h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Elegí tu camino: ofrecé tus servicios profesionales o asegurá tu lugar en experiencias exclusivas proponiendo tu propio precio.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Opción 1: Proveer Servicio */}
                <Link href="/browse?type=request" className="group">
                    <Card className="h-full border-slate-200 shadow-md hover:shadow-xl hover:border-blue-400 transition-all cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
                        <CardHeader>
                            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <HardHat className="h-7 w-7 text-blue-600" />
                            </div>
                            <CardTitle className="text-2xl group-hover:text-blue-600 transition-colors">Cotizá un Servicio</CardTitle>
                            <CardDescription className="text-base font-medium text-slate-500">
                                Para Proveedores y Profesionales
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-slate-600">
                                Explorá solicitudes de trabajo reales, enviá tu presupuesto y conseguí nuevos clientes.
                                Ideal para contratistas, técnicos y especialistas.
                            </p>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-blue-400" />
                                    Accedé a trabajos verificados
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="h-4 w-4 text-blue-400" />
                                    Enviá propuestas directas
                                </li>
                            </ul>
                            <Button className="w-full mt-4 bg-slate-900 group-hover:bg-blue-600 transition-colors">
                                Ver Solicitudes
                            </Button>
                        </CardContent>
                    </Card>
                </Link>

                {/* Opción 2: Adquirir Experiencia */}
                <Link href="/browse?type=experience" className="group">
                    <Card className="h-full border-slate-200 shadow-md hover:shadow-xl hover:border-amber-400 transition-all cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
                        <CardHeader>
                            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Sparkles className="h-7 w-7 text-amber-600" />
                            </div>
                            <CardTitle className="text-2xl group-hover:text-amber-600 transition-colors">Cotizá una Experiencia</CardTitle>
                            <CardDescription className="text-base font-medium text-slate-500">
                                Para Participantes y Entusiastas
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-slate-600">
                                Ofertá cuánto pagarías por sumarte a una experiencia única.
                                Asegurá tu lugar en eventos, visitas de obra y masterclasses exclusivas.
                            </p>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li className="flex items-center gap-2">
                                    <Ticket className="h-4 w-4 text-amber-500" />
                                    Proponé tu precio por el spot
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="h-4 w-4 text-amber-500" />
                                    Experiencias Mínimas Ejecutables
                                </li>
                            </ul>
                            <Button className="w-full mt-4 bg-white border-2 border-slate-200 text-slate-900 hover:border-amber-400 hover:text-amber-700 transition-colors">
                                Explorar Experiencias
                            </Button>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    )
}
