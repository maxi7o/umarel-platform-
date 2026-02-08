# 🚀 Despliegue de Agente Scout (n8n + Meta)

Este documento guía la configuración final para activar el Agente Scout que busca leads en Instagram/Facebook y publica respuestas automáticas.

## 1. Requisitos Previos

Asegurate de tener las siguientes variables de entorno configuradas (en `.env` para local, o en tu servidor n8n):

- `OPENAI_API_KEY`: Para el análisis de intención.
- `META_ACCESS_TOKEN`: Para publicar respuestas en Instagram/Facebook.
- `TELEGRAM_CHAT_ID`: Para recibir notificaciones del bot.
- `TELEGRAM_BOT_TOKEN`: Token de tu bot de Telegram (se configura en las credenciales de n8n).

## 2. Importar el Workflow

El archivo definitivo y corregido es:
`workflow-scout-auto.json`

1. Abre tu instancia de **n8n**.
2. Ve a **Workflows** > **Import from File**.
3. Selecciona `.agent/marketing/workflow-scout-auto.json`.

## 3. Configurar Credenciales en n8n

El workflow importado requerirá que configures/selecciones las siguientes credenciales:

1.  **Supabase (PostgreSQL)**:
    - Host: `db.fxclozsezqfyvxirorei.supabase.co`
    - User/Pass: (Tus credenciales de la DB)
    - Database: `postgres`
2.  **OpenAI API**:
    - Usa tu `OPENAI_API_KEY`.
3.  **Telegram API**:
    - Crea un bot con `@BotFather` si no tenés uno.
    - Pega el Token.
4.  **Apify API** (Opcional si usas el scraper):
    - Si vas a usar Apify para scraping real, necesitas una cuenta y token de Apify.

## 4. Verificar la Tabla `scout_leads`

La tabla ya existe en tu base de datos Supabase con la estructura correcta:
- `source` (instagram, facebook)
- `external_id` (ID único del post)
- `intent_score` (0-10)
- `status` (pending_review, approved, etc.)

## 5. Prueba de Ejecución

1. En n8n, haz clic en **Execute Workflow**.
2. Verifica que el nodo "Apify" traiga datos (o usa datos Mock si no tienes créditos Apify).
3. Verifica que se analicen con OpenAI.
4. Si el score es > 9, se intentará un Auto-Post.
5. Si el score es 7-8, se guardará como `pending_review` y te llegará un Telegram.

## 6. Auto-Reply API

El nodo "Auto-Post Reply" llama a tu propia API:
`POST https://elentendido.ar/api/admin/scout/auto-post`

Asegurate de que en producción (Vercel) tengas definida la variable de entorno:
`META_ACCESS_TOKEN`

Si esta variable falta, la API simulará el posteo (loggeará "simulated: true") pero no publicará nada real.
