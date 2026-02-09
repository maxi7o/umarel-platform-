# 🚀 Vercel Deployment Checklist - El Entendido

## ✅ Variables de Entorno Requeridas en Vercel

### 🔴 **CRÍTICAS** (La app no funciona sin estas)

1. **Supabase**
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   DATABASE_URL
   ```

2. **OpenAI** (Para features de IA)
   ```
   OPENAI_API_KEY
   ```
   - ✅ **YA CONFIGURADA** en tu `.env`
   - 🔗 Verificar en: https://platform.openai.com/api-keys
   - 💰 Asegurate de tener créditos disponibles

3. **MercadoPago** (Para pagos)
   ```
   NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
   MERCADOPAGO_ACCESS_TOKEN
   MERCADOPAGO_WEBHOOK_SECRET
   ```
   - ✅ Tenés keys de **SANDBOX** configuradas
   - ⚠️ Para producción, cambiar a keys **PRODUCTION** (APP_USR-)

4. **Resend** (Para emails)
   ```
   RESEND_API_KEY
   ```
   - ✅ **YA CONFIGURADA** en tu `.env`

5. **App URLs**
   ```
   NEXT_PUBLIC_APP_URL=https://elentendido.ar
   NEXT_PUBLIC_SITE_URL=https://elentendido.ar
   ```

---

### 🟡 **OPCIONALES** (Features específicas)

6. **Google Gemini** (Fallback AI)
   ```
   GOOGLE_GENERATIVE_AI_KEY
   GEMINI_API_KEY
   ```
   - ✅ **YA CONFIGURADA** en tu `.env`

7. **Verifik** (Verificación de identidad)
   ```
   VERIFIK_API_TOKEN
   ```
   - ⚠️ Necesaria para verificación de DNI en producción
   - En desarrollo usa mock automáticamente

8. **Redis** (Queue processing)
   ```
   REDIS_URL
   ```
   - Solo si usás background jobs
   - Opcional para MVP

9. **Discord Alerts**
   ```
   DISCORD_WEBHOOK_URL
   ```
   - Para notificaciones de errores

10. **Google Search Console**
    ```
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ```
    - Para verificar propiedad del sitio

---

## 📋 Pasos para Configurar en Vercel

### 1. Ir a Vercel Dashboard
```
https://vercel.com/maxi7o/umarel-platform-/settings/environment-variables
```

### 2. Agregar Variables de Entorno

Para cada variable:
1. Click en **"Add New"**
2. Pegar el nombre (ej: `OPENAI_API_KEY`)
3. Pegar el valor
4. Seleccionar environments: **Production**, **Preview**, **Development**
5. Click **"Save"**

### 3. Redeploy

Después de agregar las variables:
```bash
git commit --allow-empty -m "trigger: redeploy with env vars"
git push origin main
```

O desde Vercel Dashboard:
- Ir a **Deployments**
- Click en el último deployment
- Click **"Redeploy"**

---

## 🧪 Testing de APIs en Producción

### OpenAI API
```bash
# Test endpoint
curl -X POST https://elentendido.ar/api/projects/ai-suggestions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Desarrollo de Landing Page",
    "description": "Necesito una landing page moderna para mi negocio",
    "category": "tech"
  }'
```

**Esperado**: JSON con `suggestions` (título optimizado, hitos, precios)

### MercadoPago (Sandbox)
```bash
# Test payment creation
curl https://elentendido.ar/api/payments/mercadopago/checkout
```

**Esperado**: Redirect URL de MercadoPago

---

## 🔍 Verificación Post-Deploy

### 1. Verificar Build
- ✅ Build exitoso en Vercel
- ✅ No errores de TypeScript
- ✅ Tests pasando (16/20)

### 2. Verificar Features

| Feature | Endpoint | Status |
|---------|----------|--------|
| AI Suggestions | `/api/projects/ai-suggestions` | ✅ Ready |
| Verification Status | `/api/verify/status` | ✅ Ready |
| Notifications | `/api/notifications` | ✅ Ready |
| SEO Sitemap | `/sitemap.xml` | ✅ Ready |
| SEO Robots | `/robots.txt` | ✅ Ready |

### 3. Verificar SEO
- [ ] Sitemap accesible: https://elentendido.ar/sitemap.xml
- [ ] Robots.txt accesible: https://elentendido.ar/robots.txt
- [ ] Meta tags en landing page
- [ ] Schema.org en source

### 4. Verificar Logs
```
Vercel Dashboard > Logs
```
Buscar errores relacionados con:
- `OPENAI_API_KEY`
- `MERCADOPAGO_ACCESS_TOKEN`
- Database connections

---

## 🚨 Troubleshooting

### Error: "OPENAI_API_KEY is not set"
**Solución**: 
1. Verificar que la variable esté en Vercel
2. Redeploy
3. Verificar que no esté comentada

### Error: "Insufficient quota" (OpenAI)
**Solución**:
1. Ir a https://platform.openai.com/settings/organization/billing
2. Agregar créditos ($5-10 USD es suficiente para empezar)

### Error: MercadoPago "Invalid credentials"
**Solución**:
1. Verificar que uses keys de SANDBOX para testing
2. Para producción, cambiar a keys APP_USR-

### Error: Database connection timeout
**Solución**:
1. Verificar `DATABASE_URL` en Vercel
2. Verificar que Supabase permita conexiones desde Vercel
3. Revisar IP whitelist en Supabase

---

## 📊 Monitoreo

### Vercel Analytics
- Activar en: https://vercel.com/maxi7o/umarel-platform-/analytics

### OpenAI Usage
- Monitorear en: https://platform.openai.com/usage

### MercadoPago Transactions
- Dashboard: https://www.mercadopago.com.ar/developers/panel

---

## ✅ Checklist Final

- [ ] Todas las variables críticas configuradas en Vercel
- [ ] OpenAI API key válida con créditos
- [ ] MercadoPago en modo SANDBOX (para testing)
- [ ] Resend API key configurada
- [ ] App URLs apuntando a producción
- [ ] Build exitoso
- [ ] Tests pasando
- [ ] Sitemap accesible
- [ ] AI suggestions funcionando
- [ ] Verificación de identidad funcionando
- [ ] Sistema de notificaciones funcionando

---

## 🎯 Próximos Pasos Después del Deploy

1. **Ejecutar migración de notificaciones**:
   ```bash
   npm run db:push
   # o ejecutar manualmente el SQL
   ```

2. **Configurar Google Search Console**:
   - Agregar propiedad
   - Enviar sitemap
   - Verificar indexación

3. **Testing en producción**:
   - Crear cuenta de prueba
   - Probar flujo completo de creación de proyecto
   - Probar sugerencias de IA
   - Probar verificación de identidad

4. **Monitorear errores**:
   - Revisar logs de Vercel
   - Configurar alertas de errores
   - Monitorear uso de APIs

---

**Última actualización**: 2026-02-09  
**Status**: ✅ Listo para deploy
