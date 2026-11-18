# Cómo conectar TutorBot y la calculadora con Gemini

TutorBot y el plan de la calculadora llaman al archivo `asistente-ia.php`, que habla con la API de Google Gemini. **La clave nunca va en el navegador**: vive en el servidor. Hay dos caminos.

## Primero: probar en tu computador con PHP (XAMPP)
Live Server **no ejecuta PHP**, por eso allí TutorBot dice «Ahora mismo no puedo responder». Para probarlo con PHP real:
1. Instala XAMPP, copia la carpeta `tutorias-web` a `C:\xampp\htdocs\` y en el panel de XAMPP pulsa **Start** en Apache.
2. Abre `http://localhost/tutorias-web/` (no uses Live Server para esto).
3. Abre `http://localhost/tutorias-web/setup.php`, pega tu clave de Gemini y guarda. Se guarda en `C:\xampp\htdocs\gemini_api_key.php`, una carpeta por encima de la web.
4. Abre `http://localhost/tutorias-web/diagnostico.php`. Debe mostrar: cURL activo, clave encontrada, «Conexion con Google: HTTP 200» y una lista de modelos. Si la lista no incluye `gemini-3.1-flash-lite`, `gemini-3.5-flash` ni `gemini-2.5-flash-lite`, abre `asistente-ia.php` y cambia la variable `$MODELS` por uno o dos nombres de esa lista.
5. Prueba TutorBot. Cuando todo funcione, **borra `diagnostico.php` y `setup.php`**.
**cURL no es obligatorio:** si en XAMPP el `error.log` dice «Unable to load dynamic library 'curl'», no hace falta arreglarlo. La web usa la extensión `openssl` (activa por defecto) mediante `http.php`. `diagnostico.php` te dice si `openssl` está activo y qué archivo de certificados encontró.
Si `diagnostico.php` dice «SSL certificate problem», en `C:\xampp\php\php.ini` pon `curl.cainfo = "C:\xampp\apache\bin\curl-ca-bundle.crt"` y reinicia Apache.

> Nombres de modelos: Google retira modelos con el tiempo (la página oficial de deprecaciones de la API de Gemini lista `gemini-2.5-flash` con retiro desde octubre de 2026). Por eso el proxy prueba varios en orden. Revisa la lista cada pocos meses.

## Camino A (recomendado para Hostinger): proxy PHP incluido
1. Crea tu clave en **Google AI Studio** → «Crear clave de API» (las nuevas empiezan por `AQ.` y las antiguas por `AIza`; sirven ambas).
2. Sube el contenido del proyecto a `public_html` (con `.htaccess`).
3. Abre `https://tu-dominio/setup.php`, pega la clave y guarda. La página la valida con Google y la guarda en `gemini_api_key.php`, **fuera** de `public_html`.
4. **Borra `setup.php` del servidor.**
5. Prueba: abre TutorBot, pregunta «¿cuánto cuesta una clase virtual?». Debe responder con la tarifa de `knowledge.php`.

El proxy ya incluye: lectura de la clave desde la variable de entorno `GEMINI_API_KEY` o desde el archivo, límites por persona y por día, historial corto, y un mensaje de respaldo si Google falla (la web ofrece entonces WhatsApp). El modelo se define en la variable `$MODELS` al inicio de `asistente-ia.php`; verifica en la documentación de Google cuál es el nombre vigente, porque cambian con el tiempo.

## Camino B: servidor Node con variable de entorno y SDK oficial
Úsalo si tu hosting es Node (VPS, Render, Railway, etc.).
```bash
npm init -y
npm install @google/genai express
export GEMINI_API_KEY="tu_clave"        # Windows PowerShell: $env:GEMINI_API_KEY="tu_clave"
```
```js
// servidor.js
import express from "express";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});            // lee GEMINI_API_KEY del entorno automáticamente
// o, explícito: new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const app = express();
app.use(express.json({ limit: "20kb" }));
app.use(express.static("."));              // sirve index.html, styles.css, main.js

app.post("/asistente-ia.php", async (req, res) => {   // misma ruta que usa main.js
  try {
    const message = String(req.body?.message || "").slice(0, 500);
    if (!message) return res.status(400).json({ error: "vacío" });
    const r = await ai.models.generateContent({
      model: "gemini-2.5-flash",           // usa el nombre vigente de la documentación
      contents: message,
      config: { systemInstruction: "Eres TutorBot... (copia el texto de knowledge.php)" },
    });
    res.json({ reply: r.text });
  } catch (e) {
    res.status(502).json({ error: "ia" });  // main.js muestra el respaldo con WhatsApp
  }
});
app.listen(3000);
```
Este camino lo documenté según la guía oficial de Google (quickstart de la API de Gemini), pero **no lo ejecuté aquí**: pruébalo y añade límites por persona antes de publicarlo.

## Precauciones de seguridad
- Nunca escribas la clave en `index.html`, `main.js` ni la subas a GitHub. Si se filtra, bórrala en AI Studio y crea otra.
- Mantén `setup.php` fuera del servidor después de usarlo.
- Pon un límite de gasto/cuota en tu proyecto de Google y revisa el uso.
- La capa gratuita puede usar lo escrito para mejorar los modelos de Google. Como hay menores, activa la facturación (clave de pago) antes de usar la web con clientes y avisa en la política de privacidad (ya incluida).
- Pide a los visitantes que no escriban datos personales en el chat.

## Si algo falla
| Síntoma | Qué revisar |
|---|---|
| «Ahora mismo no puedo responder» | El navegador no llega a `asistente-ia.php` (Live Server, o falta el archivo). En DevTools → Network mira el estado de la petición: 404 o 405 = no hay PHP |
| TutorBot responde «Escríbenos por WhatsApp…» | Sí hay PHP pero falló Gemini: abre `diagnostico.php` (clave, cURL, modelos) |
| Error 403 «origin» | Abres la web por un dominio distinto al del servidor (www y sin www cuentan distinto) |
| Funciona en el servidor pero no en Live Server | Es normal: Live Server no ejecuta PHP |
| Respuestas lentas o error 429 | Límite de la capa gratuita; espera o usa clave de pago |
