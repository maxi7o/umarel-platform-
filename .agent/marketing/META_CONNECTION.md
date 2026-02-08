# Guía de Conexión: Meta (Facebook/Instagram) para Auto-Posting 🚀

Para que tu agente pueda publicar contenido en Instagram y Facebook, necesitas conectar tu cuenta Business a n8n usando la **Meta Graph API**.

## Paso 1: Crear una App en Meta Developers

1.  Ve a [Meta for Developers](https://developers.facebook.com/) y haz login.
2.  Clic en **"Mis Apps"** > **"Crear App"**.
3.  Selecciona **"Otro"** (Other) > **Siguiente**.
4.  Selecciona tipo **"Negocios"** (Business) > **Siguiente**.
5.  Ponle un nombre (ej: `Umarel Publisher`) y asóciala a tu cuenta comercial.
6.  Clic en **"Crear App"**.

## Paso 2: Configurar Instagram Graph API

1.  En el panel de la App, busca **"Instagram Graph API"** y dale a **"Configurar"**.
2.  En el menú lateral izquierdo, ve a **"Revisión de la aplicación"** > **"Permisos y funciones"**.
3.  Busca y solicita acceso avanzado (o standar para test) a estos permisos:
    *   `instagram_basic`
    *   `instagram_content_publish` (CRÍTICO para postear)
    *   `pages_manage_posts` (Para Facebook)
    *   `pages_read_engagement`
4.  Ve a **"Configuración"** > **"Básica"**. Copia tu **Identificador de la App (App ID)** y **Clave secreta (App Secret)**.

## Paso 3: Generar Token de Acceso (Usuario del sistema)

1.  Ve al [Explorador de la Graph API](https://developers.facebook.com/tools/explorer/).
2.  Selecciona tu App en "Meta App".
3.  En "Usuario o página", selecciona **"Obtener token de acceso de usuario"**.
4.  Marca los permisos del Paso 2.
5.  Clic en **"Generar token de acceso"**. Autoriza con tu cuenta de Instagram Business.
6.  (Opcional pero recomendado para producción) Intercambia este token corto por uno de larga duración (60 días) usando el endpoint `oauth/access_token` o la herramienta de depuración.

## Paso 4: Conectar en n8n

1.  Abre tu n8n.
2.  Ve a **Credentials** > **Add Credential**.
3.  Busca **"Facebook Graph API"** (o Instagram si usas el nodo específico).
4.  Tipo de Autenticación: **Access Token** (lo más fácil para empezar).
5.  Pega el Token que generaste en el Paso 3.
6.  ¡Listo!

---

### ⚠️ Importante: Cuenta de Instagram Business
Asegúrate de que tu cuenta de Instagram sea **"Business"** o **"Creador"** y esté vinculada a una **Fan Page de Facebook**. Si es una cuenta personal, la API no funcionará.
