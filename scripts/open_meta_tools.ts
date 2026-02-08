
import { exec } from 'child_process';

const openUrl = (url: string) => exec(`open "${url}"`);

console.log('🚀 Abriendo herramientas de Meta...');

// 1. Graph API Explorer (Directo al grano)
// El parametro 'classic' a veces ayuda a limpiar la vista, pero la URL base es suficiente.
openUrl('https://developers.facebook.com/tools/explorer/');

// 2. Apps (por si no tienen una creaada)
openUrl('https://developers.facebook.com/apps/');

console.log(`
📋 PASOS PARA OBTENER EL TOKEN:

1. Ve a la pestaña que se abrió de "Mis Apps".
   - Si no tienes una App, crea una: Tipo "Negocios" (Business).
   
2. Ve a la pestaña "Graph API Explorer".
   - Arriba a la derecha, en "Meta App", selecciona la App que creaste.
   - En "User or Page", selecciona "Get User Access Token".
   
3. En el campo "Add a Permission", busca y selecciona estos 4:
     ✅ instagram_basic
     ✅ instagram_content_publish
     ✅ pages_manage_posts
     ✅ pages_read_engagement
     
4. Dale al botón azul "Generate Access Token".
   - Te pedirá login con tu cuenta de Facebook/Business.
   - Acepta todo.
   
5. Copia el token largo que aparece arriba (empieza con EAA...).
`);
