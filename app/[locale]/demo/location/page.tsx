import { LocationPicker } from '@/components/forms/location-picker';
import { LocationInput } from '@/components/forms/location-input';
import { LocationMap } from '@/components/forms/location-map';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LocationDemoPage() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Sistema de Ubicación</h1>
                <p className="text-stone-600">
                    Demostración de búsqueda de ubicaciones con caché, fallback y mapas interactivos
                </p>
            </div>

            <Tabs defaultValue="picker" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="picker">Picker Completo</TabsTrigger>
                    <TabsTrigger value="search">Solo Búsqueda</TabsTrigger>
                    <TabsTrigger value="map">Solo Mapa</TabsTrigger>
                </TabsList>

                <TabsContent value="picker" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>LocationPicker - Componente Combinado</CardTitle>
                            <CardDescription>
                                Búsqueda con autocompletado + mapa interactivo. El marcador es arrastrable.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <LocationPicker
                                onLocationSelect={(data) => {
                                    console.log('📍 Ubicación seleccionada:', data);
                                }}
                                defaultLat={-34.6037}
                                defaultLng={-58.3816}
                            />
                        </CardContent>
                    </Card>

                    <Card className="bg-stone-50 border-stone-200">
                        <CardHeader>
                            <CardTitle className="text-base">Características</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">✓</span>
                                <span>Búsqueda con caché (las búsquedas populares se guardan)</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">✓</span>
                                <span>Fallback automático: Photon → Nominatim</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">✓</span>
                                <span>Mapa interactivo con marcador arrastrable</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">✓</span>
                                <span>100% gratuito, sin límites de uso</span>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="search" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>LocationInput - Solo Búsqueda</CardTitle>
                            <CardDescription>
                                Autocompletado de direcciones con caché. Probá buscar "palermo" o "recoleta".
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <LocationInput
                                placeholder="Buscar dirección en Argentina..."
                                onChange={(value, data) => {
                                    console.log('Dirección:', value);
                                    console.log('Datos:', data);
                                }}
                            />

                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h4 className="font-semibold text-blue-900 mb-2">💡 Tip</h4>
                                <p className="text-sm text-blue-800">
                                    Abrí la consola del navegador para ver los logs de caché y fallback.
                                    Después de buscar algo, volvé a buscarlo y verás "📦 Cache hit".
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Endpoints Utilizados</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div>
                                <div className="font-semibold text-orange-600">Primario: Photon (Komoot)</div>
                                <code className="text-xs bg-stone-100 px-2 py-1 rounded block mt-1">
                                    https://photon.komoot.io/api/
                                </code>
                                <p className="text-stone-600 mt-1">Rápido (~100-200ms), sin límites</p>
                            </div>
                            <div>
                                <div className="font-semibold text-blue-600">Fallback: Nominatim (OSM)</div>
                                <code className="text-xs bg-stone-100 px-2 py-1 rounded block mt-1">
                                    https://nominatim.openstreetmap.org/search
                                </code>
                                <p className="text-stone-600 mt-1">Backup confiable (~300-500ms)</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="map" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>LocationMap - Mapa Interactivo</CardTitle>
                            <CardDescription>
                                Mapa con OpenStreetMap tiles y MapLibre GL. Arrastrá el marcador.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <LocationMap
                                latitude={-34.6037}
                                longitude={-58.3816}
                                zoom={13}
                                interactive={true}
                                onLocationChange={(lat, lng) => {
                                    console.log('Nueva posición:', lat, lng);
                                }}
                                className="h-[500px] rounded-lg"
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Mapa de Solo Lectura</CardTitle>
                            <CardDescription>
                                Útil para mostrar ubicaciones sin permitir edición
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <LocationMap
                                latitude={-34.5889}
                                longitude={-58.4199}
                                zoom={15}
                                interactive={false}
                                className="h-[300px] rounded-lg"
                            />
                            <p className="text-sm text-stone-600 mt-2">
                                📍 Palermo, Buenos Aires
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Card className="mt-8 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                <CardHeader>
                    <CardTitle>🎉 Ventajas vs Google Maps</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <h4 className="font-semibold mb-2">Nuestra Solución</h4>
                            <ul className="space-y-1 text-stone-700">
                                <li>✅ $0 por mes</li>
                                <li>✅ Sin límites de uso</li>
                                <li>✅ No rastrea usuarios</li>
                                <li>✅ Open source</li>
                                <li>✅ Caché inteligente</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Google Maps</h4>
                            <ul className="space-y-1 text-stone-700">
                                <li>❌ $200 gratis, luego $5-7/1000 req</li>
                                <li>❌ 28,000 requests/mes gratis</li>
                                <li>❌ Rastrea todo</li>
                                <li>❌ Propietario</li>
                                <li>❌ Sin caché</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-8 p-4 bg-stone-100 rounded-lg text-sm text-stone-600">
                <p>
                    📚 <strong>Documentación completa:</strong>{' '}
                    <code className="bg-white px-2 py-0.5 rounded">/docs/LOCATION_SYSTEM.md</code>
                </p>
            </div>
        </div>
    );
}
