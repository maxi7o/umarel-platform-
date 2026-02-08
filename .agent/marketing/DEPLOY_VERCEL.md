# 🌐 Configuración de Vercel (Producción)

Los cambios de código (Navbar, Rutas API, Workflow) ya están enviados (git pushed).

Para activar el Auto-Posting en producción, sigue estos pasos finales:

1.  Ve a tu Dashboard de **Vercel** > Proyecto **Umarel Platform**.
2.  Ve a **Settings** > **Environment Variables**.
3.  Añade una nueva variable:
    *   **Key**: `META_ACCESS_TOKEN`
    *   **Value**: `EAARZBaBTj1coBQrwoIJxOz7bhNvltHeT0uWWZBOR5tywJ404gD2blMPUVgrfxrZA30ZBqFNOhhYXvdjfD0qj0HKUus90aDpOKB7zUiM9VJ36rWHmJMIUOp0fCFtkNjsaZCGZBpSUvKnf14hZCQulSppCXYzecZAIfF76P56NeQEyuLv8w1R7ZB17JHw6ZCDhGjxzpJxZAagAHJYCNWj5flvdJ0SSL6CEScGiZBAcGsPOstq57y5upbBPIj0GQvIG9W1gn5q90OwzsXW3LPGuYZC3N7CKXuAZDZD`
    *   **Environments**: Production (y Preview/Development si quieres probar ahí también).
4.  Guarda los cambios.
5.  **Redespliega** (Redeploy) la última versión para que tome la variable (o espera al próximo push, que acabamos de hacer).

¡Listo! El Agente Scout ahora podrá publicar en Instagram/Facebook desde n8n.
