import { getTranslations } from 'next-intl/server';

export default async function TermsPage() {
    return (
        <div className="container mx-auto max-w-4xl py-12 px-6">
            <h1 className="text-4xl font-bold font-outfit mb-8">Términos y Condiciones (El Entendido)</h1>
            <p className="text-sm text-muted-foreground mb-8">Última actualización: Enero 2026 - Versión 2.1 (Agnostic Layer)</p>

            <div className="prose prose-stone max-w-none">

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-sm mb-8">
                    <strong>Resumen para Humanos:</strong> "El Entendido" es una herramienta tecnológica para definir y pagar trabajos por etapas ("Slices").
                    No somos tus empleados ni tus jefes. La plata se guarda en custodia y solo se libera cuando hay evidencia aprobada.
                    Si frenás en la Etapa 1, no debés nada de la Etapa 2.
                </div>

                <h2>1. Naturaleza del Servicio ("Agnostic Layer")</h2>
                <p>
                    "El Entendido" es una plataforma tecnológica que provee infraestructura para:
                    (a) La definición técnica de proyectos mediante Inteligencia Artificial;
                    (b) La división de dichos proyectos en unidades de ejecución autónomas ("Slices");
                    (c) La gestión de pagos en custodia ("Escrow") bajo mandato irrevocable.
                    <br /><br />
                    <strong>IMPORTANTE:</strong> El Entendido NO es una empresa constructora, NO es empleador del personal, ni garantiza el resultado subjetivo de la obra.
                    Nuestra responsabilidad se limita a la custodia inalterable de los fondos y la trazabilidad de la evidencia digital.
                </p>

                <h2>2. La "Slice" como Objeto Contractual Autónomo</h2>
                <p>
                    Para minimizar conflictos, las Partes acuerdan que cada "Slice" (Etapa) constituye un <strong>contrato de obra o servicio independiente y autónomo</strong>.
                </p>
                <ul>
                    <li><strong>Safeword (Derecho de Interrupción):</strong> El Cliente tiene derecho absoluto a no iniciar la siguiente Slice sin penalidad alguna, extinguiendo la relación contractual al finalizar la Slice activa.</li>
                    <li><strong>Irrevocabilidad de Slice Iniciada:</strong> Una vez que una Slice está en estado "Active" (Fondos bloqueados), el contrato es irrevocable salvo disputa probada.</li>
                </ul>

                <h2>3. Mandato Irrevocable de Pago (Escrow)</h2>
                <p>
                    El Cliente otorga a la Plataforma un <strong>Mandato Irrevocable de Pago</strong> condicionado al cumplimiento de la Slice.
                    <ul>
                        <li>Los fondos depositados en garantía NO integran el patrimonio de la Plataforma.</li>
                        <li>La Plataforma liberará los fondos automáticamente si: (a) El Cliente aprueba la evidencia; o (b) El Cliente guarda silencio por 72 horas hábiles tras la presentación de evidencia validada por un Auditor ("Entendido").</li>
                    </ul>
                </p>

                <h2>4. Inexistencia de Relación Laboral</h2>
                <p>
                    Los Profesionales/Talentos son contratistas independientes. El uso de la plataforma NO crea relación de dependencia, sociedad,
                    o representación entre el Profesional y la Plataforma, ni entre el Profesional y el Cliente más allá de la locación de servicios puntual.
                    El Profesional es el único responsable de sus obligaciones impositivas y previsionales (Monotributo/Autónomos).
                </p>

                <h2>5. Sistema de Reputación "Aura"</h2>
                <p>
                    El "Aura" es un indicador digital de reputación y confiabilidad dentro del ecosistema.
                    <strong>El Aura NO tiene valor monetario</strong>, no es canjeable por dinero fiduciario y es propiedad exclusiva de la Plataforma,
                    la cual otorga una licencia de uso revocable al usuario. La Plataforma se reserva el derecho de resetear o penalizar el Aura ante conductas desleales (ej. colusión en validaciones).
                </p>

                <h2>6. Limitación de Responsabilidad y Renuncias</h2>
                <ul>
                    <li><strong>Renuncia a Derecho de Retención:</strong> El Profesional renuncia expresamente a ejercer derecho de retención sobre bienes o propiedades del Cliente.</li>
                    <li><strong>Limitación Genérica:</strong> La responsabilidad total de la Plataforma hacia cualquier usuario no excederá el monto de las comisiones (Fees) cobradas por la Plataforma en esa transacción específica.</li>
                </ul>

                <h2>7. Resolución de Disputas</h2>
                <p>
                    En caso de controversia sobre una Slice, las partes aceptan someterse al mecanismo de <strong>Arbitraje Descentralizado </strong> de la plataforma.
                    La decisión del árbitro basada en la evidencia digital será final para la liberación de los fondos en custodia, sin perjuicio de los derechos de las partes de reclamar daños por vía judicial ordinaria posteriormente.
                </p>

                <h2>8. Jurisdicción</h2>
                <p>
                    Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa judicial se someterá a los Tribunales Ordinarios en lo Comercial de la Ciudad Autónoma de Buenos Aires.
                </p>
            </div>
        </div>
    );
}
