import { RoleSwitcher } from '@/components/admin/role-switcher';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    TestTube2,
    Users,
    FileText,
    MessageSquare,
    CheckCircle2,
    Clock,
    AlertTriangle
} from 'lucide-react';

export default function TestingPage() {
    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                    <TestTube2 className="h-10 w-10 text-orange-600" />
                    Testing & QA Suite
                </h1>
                <p className="text-stone-600">
                    Herramientas para probar flujos completos de la plataforma
                </p>
            </div>

            {/* Role Switcher */}
            <div className="mb-8">
                <RoleSwitcher />
            </div>

            {/* Test Scenarios */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-600" />
                            Escenarios de Prueba Recomendados
                        </CardTitle>
                        <CardDescription>
                            Flujos críticos para validar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <TestScenario
                                title="1. Flujo Completo de Request"
                                steps={[
                                    'Cliente: Crear request de remodelación',
                                    'Provider: Ver request y crear quote',
                                    'Cliente: Aceptar quote',
                                    'Provider: Completar trabajo',
                                    'Cliente: Aprobar y pagar',
                                ]}
                                roles={['client', 'provider']}
                            />
                            <TestScenario
                                title="2. Flujo de Disputa"
                                steps={[
                                    'Cliente: Crear request',
                                    'Provider: Completar trabajo',
                                    'Cliente: Disputar (trabajo incompleto)',
                                    'Admin: Revisar evidencia',
                                    'Admin: Resolver disputa',
                                ]}
                                roles={['client', 'provider', 'admin']}
                            />
                            <TestScenario
                                title="3. Flujo de Q&A Comunitario"
                                steps={[
                                    'Cliente: Hacer pregunta en request',
                                    'Provider 1: Responder pregunta',
                                    'Provider 2: Responder pregunta',
                                    'Cliente: Marcar mejor respuesta',
                                    'Provider 1: Recibir recompensa',
                                ]}
                                roles={['client', 'provider']}
                            />
                            <TestScenario
                                title="4. Flujo de Material Advance"
                                steps={[
                                    'Cliente: Crear request con materiales',
                                    'Provider: Quote con acopio 40%',
                                    'Cliente: Aprobar y pagar acopio',
                                    'Provider: Comprar materiales',
                                    'Provider: Completar trabajo',
                                    'Cliente: Pagar balance',
                                ]}
                                roles={['client', 'provider']}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-green-600" />
                            Datos de Prueba
                        </CardTitle>
                        <CardDescription>
                            Scripts para generar datos sintéticos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 bg-stone-50 rounded-lg border">
                                <h4 className="font-semibold mb-2">Generar Usuarios de Prueba</h4>
                                <code className="text-xs bg-stone-900 text-green-400 p-2 rounded block mb-2">
                                    npm run script scripts/seed_test_users.ts
                                </code>
                                <p className="text-sm text-stone-600">
                                    Crea 3 usuarios: cliente, provider y admin
                                </p>
                            </div>

                            <div className="p-4 bg-stone-50 rounded-lg border">
                                <h4 className="font-semibold mb-2">Generar Requests de Prueba</h4>
                                <code className="text-xs bg-stone-900 text-green-400 p-2 rounded block mb-2">
                                    npm run script scripts/seed_test_requests.ts
                                </code>
                                <p className="text-sm text-stone-600">
                                    Crea 10 requests en diferentes estados
                                </p>
                            </div>

                            <div className="p-4 bg-stone-50 rounded-lg border">
                                <h4 className="font-semibold mb-2">Generar Transacciones</h4>
                                <code className="text-xs bg-stone-900 text-green-400 p-2 rounded block mb-2">
                                    npm run script scripts/seed_test_transactions.ts
                                </code>
                                <p className="text-sm text-stone-600">
                                    Crea transacciones completas con pagos
                                </p>
                            </div>

                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h4 className="font-semibold mb-2 text-blue-900">Reset Completo</h4>
                                <code className="text-xs bg-stone-900 text-green-400 p-2 rounded block mb-2">
                                    npm run db:reset && npm run script scripts/seed_all.ts
                                </code>
                                <p className="text-sm text-blue-800">
                                    ⚠️ Borra todo y regenera datos de prueba
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Tips */}
            <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-orange-600" />
                        Tips para Testing Efectivo
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <h4 className="font-semibold flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                Mejores Prácticas
                            </h4>
                            <ul className="text-sm space-y-1 text-stone-700">
                                <li>✅ Usa el Role Switcher en lugar de múltiples navegadores</li>
                                <li>✅ Prueba flujos completos de principio a fin</li>
                                <li>✅ Verifica notificaciones y emails</li>
                                <li>✅ Prueba casos edge (disputas, cancelaciones)</li>
                                <li>✅ Valida cálculos de pagos y comisiones</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                Qué Validar
                            </h4>
                            <ul className="text-sm space-y-1 text-stone-700">
                                <li>🔍 Permisos: ¿Cada rol ve lo que debe?</li>
                                <li>🔍 Notificaciones: ¿Llegan a tiempo?</li>
                                <li>🔍 Pagos: ¿Los montos son correctos?</li>
                                <li>🔍 Estados: ¿Las transiciones funcionan?</li>
                                <li>🔍 UI/UX: ¿Es intuitivo para cada rol?</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function TestScenario({
    title,
    steps,
    roles
}: {
    title: string;
    steps: string[];
    roles: string[];
}) {
    const roleColors: Record<string, string> = {
        client: 'bg-blue-100 text-blue-800',
        provider: 'bg-green-100 text-green-800',
        admin: 'bg-purple-100 text-purple-800',
    };

    return (
        <div className="p-4 bg-stone-50 rounded-lg border">
            <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold">{title}</h4>
                <div className="flex gap-1">
                    {roles.map((role) => (
                        <Badge
                            key={role}
                            variant="outline"
                            className={roleColors[role]}
                        >
                            {role}
                        </Badge>
                    ))}
                </div>
            </div>
            <ol className="text-sm space-y-1.5 text-stone-700">
                {steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 text-orange-800 text-xs flex items-center justify-center font-semibold">
                            {i + 1}
                        </span>
                        <span>{step}</span>
                    </li>
                ))}
            </ol>
        </div>
    );
}
