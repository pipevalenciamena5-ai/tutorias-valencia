# Tutorías de matemáticas · Andrés Valencia (sitio demo)

Página de una sola pantalla larga, hecha con HTML, CSS y JavaScript simples.

## Archivos
- `index.html` — el contenido de la página.
- `styles.css` — colores y diseño (los colores están al inicio, en `:root`).
- `main.js` — comportamiento: calculadora, pago simbólico, asistente, descargas y formulario.
- `http.php` — envía las consultas a Google (cURL u openssl, lo que esté activo).
- `asistente-ia.php`, `knowledge.php`, `setup.php` — TutorBot y plan con Gemini (solo funcionan en un servidor con PHP, como Hostinger). Guía: `GUIA-GEMINI.md`.
- `assets/guias/` — 3 guías en PDF sin respuestas y sus soluciones en PDF aparte.
- `assets/img/` — aquí van las imágenes (`hero.webp`, `docente.webp`).
- `herramientas/` — programas para crear y convertir imágenes.

## 1. Verla en Visual Studio Code
1. Abre la carpeta en VS Code (Archivo → Abrir carpeta).
2. Instala la extensión **Live Server**.
3. Clic derecho en `index.html` → «Open with Live Server».

Con Live Server todo funciona **menos TutorBot y el plan con IA**, porque necesitan PHP. Ahí verás «Ahora mismo no puedo responder». Es lo esperado. Para probarlos en tu computador usa XAMPP (pasos en `GUIA-GEMINI.md`).

## 2. Qué editar
**Interruptor `DEMO`** (inicio de `main.js`): mientras sea `true`, la web muestra el aviso «sitio en preparación» y los docentes y etiquetas de ejemplo. Cuando tengas todo real y aprobado, ponlo en `false`.
**Testimonios y métricas:** la lista `TS` de `main.js` está vacía a propósito y la sección se oculta. Añade solo casos reales y con autorización escrita: `{t:"texto", a:"Madre de estudiante de 10.º"}`. No inventes cifras de mejora de notas.
**Docentes asociados:** edita la lista `DOC` de `main.js`. Los dos de ejemplo desaparecen con `DEMO=false`.
**Puntaje ICFES 357/500:** ten el certificado a mano por si un cliente lo pide.
- Textos, tarifas y horarios: `index.html` y los datos al inicio de `main.js` (paquetes `PK`, servicios `SV`, etc.). Todo lo marcado «ejemplo» hay que reemplazarlo por datos reales.
- Lo que sabe el asistente: `knowledge.php` (debe coincidir con la web).
- WhatsApp: en `main.js`, línea `var CFG={wa:"573158876852"}` (57 es el código de Colombia). Correo: busca `pipevalenciamena5@gmail.com` en `index.html` y `knowledge.php`.
- Textos legales: revísalos con un abogado antes de usar la página con clientes.

## 3. Conectar la clave de Gemini (resumen; guía completa en `GUIA-GEMINI.md`)
1. Entra a **Google AI Studio** y pulsa «Crear clave de API». Copia la clave (las nuevas empiezan por `AQ.` y las antiguas por `AIza`; sirven ambas).
2. Publica la carpeta en Hostinger (paso 5).
3. Abre `https://tu-dominio/setup.php`, pega la clave y guarda. La página la valida y la guarda fuera de la carpeta pública.
4. **Borra `setup.php` del servidor** al terminar.
5. Prueba el asistente en la página. Si no responde, dirá que no está disponible y ofrecerá WhatsApp.

Nunca escribas la clave en `index.html` ni en `main.js`: cualquiera podría verla. En la capa gratuita Google puede usar lo que se escribe para mejorar sus modelos; como hay menores, activa la facturación de Google antes de usar la web con clientes reales. El asistente tiene límites por persona y por día para cuidar la cuota.

## 4. Imágenes con IA
La página ya tiene dos espacios: `assets/img/hero.webp` (fondo de la portada) y `assets/img/docente.webp` (foto de «Sobre el docente»). Si el archivo no existe, se ve el diseño por defecto.
1. Crea una cuenta en platform.openai.com, añade saldo en Billing (unos 10 USD; el gasto real suele ser 2 o 3) y crea una clave en «API keys».
2. Guarda la clave en una carpeta **fuera** de este proyecto, por ejemplo `../tutorias-ia/clave-openai.txt`.
3. Genera la portada (necesitas Node 18 o superior):
```
node herramientas/generar-foto.mjs --clave ../tutorias-ia/clave-openai.txt --salida ../tutorias-ia/hero.jpg --calidad medium --tamano 2048x1152 --prompt "Escritorio minimalista con un cuaderno de ecuaciones y una gráfica de función verde esmeralda luminosa, fondo negro #050908, luz suave, sin personas, sin texto, sin marcas de agua. El objeto principal en el tercio derecho y espacio vacío a la izquierda."
```
4. Convierte a WebP (instala Pillow solo si lo pide): `python herramientas/webp_convert.py --src ../tutorias-ia --dst assets/img`. El archivo debe llamarse `hero.jpg` para salir como `hero.webp`.
5. Para `docente.webp` usa **una foto real tuya**. No uses una cara generada con IA presentada como si fueras tú.

## 5. Publicar en Hostinger
Sube **el contenido** de esta carpeta (sin `herramientas/` ni este README) a `public_html` con el Administrador de archivos. Luego sigue el paso 3.
