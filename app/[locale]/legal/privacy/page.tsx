export default function PrivacyPage() {
    return (
        <div className="container mx-auto max-w-4xl py-12 px-6">
            <h1 className="text-4xl font-bold font-outfit mb-8">Política de Privacidad</h1>
            <p className="text-sm text-muted-foreground mb-8">Última actualización: Enero 2026 - Cumplimiento Ley 25.326 (Argentina)</p>

            <div className="prose prose-stone max-w-none">
                <h2>1. Información que Recopilamos</h2>
                <p>
                    Para brindar seguridad y transparencia en las obras, recopilamos:
                    <ul>
                        <li><strong>Datos de Cuenta:</strong> Nombre, DNI/CUIT (para facturación y seguridad), email, teléfono.</li>
                        <li><strong>Datos de Verificación (Biometría):</strong> Fotos de DNI y selfies para validar identidad (Proceso KYC).</li>
                        <li><strong>Evidencia de Obra:</strong> Fotos, videos y <strong>geolocalización precisa</strong> al momento de subir avances.</li>
                    </ul>
                </p>

                <h2>2. Uso de los Datos</h2>
                <p>
                    <ul>
                        <li><strong>Conexión:</strong> Facilitar el contacto entre quien pide la obra y quien la hace.</li>
                        <li><strong>Garantía de Verdad ("Proof of Truth"):</strong> Usamos metadata (GPS y hora) para validar que la foto de la obra es real y reciente.</li>
                        <li><strong>IA y Mejora:</strong> Análisis anónimo de presupuestos para mejorar las sugerencias de precios justos.</li>
                        <li><strong>Seguridad:</strong> Detección de fraude y cumplimiento normativo.</li>
                    </ul>
                </p>

                <h2>3. Compartir Datos</h2>
                <p>
                    No vendemos tus datos. Solo los compartimos estrictamente para operar:
                    <ul>
                        <li><strong>Mercado Pago:</strong> Para procesar los cobros y pagos en garantía.</li>
                        <li><strong>Contrapartes:</strong> Cuando aceptás un trabajo, el Cliente/Profesional ve tus datos de contacto necesarios.</li>
                        <li><strong>Autoridades:</strong> Si hay requerimiento judicial (ej. AFIP, Justicia).</li>
                    </ul>
                </p>

                <h2>4. Tus Derechos (Habeas Data)</h2>
                <p>
                    Conforme a la Ley 25.326, tenés derecho a acceder, rectificar o suprimir tus datos.
                    Podes ejercer estos derechos escribiendo a <strong>soporte@elentendido.ar</strong>.
                    <br />
                    <em>Nota: Ciertos datos de transacciones financieras deben conservarse por 10 años por leyes fiscales.</em>
                </p>
                <p className="text-xs text-muted-foreground mt-4">
                    El órgano de control es la Agencia de Acceso a la Información Pública (Av. Pte. Gral. Julio A. Roca 710, piso 3°, CABA).
                </p>
            </div>
        </div>
    );
}
