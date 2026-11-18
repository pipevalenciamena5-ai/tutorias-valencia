exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const { message } = JSON.parse(event.body || "{}");
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ reply: "Falta configurar la clave de Gemini en Netlify." }) };
    }

    // Instrucciones y datos reales para que TutorBot sepa qué responder
    const systemPrompt = `Eres TutorBot, el asistente virtual oficial de Tutorías Valencia (liderado por Andrés Felipe Valencia Mena).
Tu función es responder dudas sobre horarios, materias, tarifas, metodología y cómo reservar sesiones.
Reglas estrictas:
- NUNCA resuelvas tareas, exámenes ni ejercicios académicos; explica que nuestro enfoque es enseñar paso a paso para que el estudiante domine el tema.
- Sé amable, directo, profesional y breve (máximo 3-4 líneas por respuesta).
- Si preguntan por precios/tarifas: explica que manejamos planes flexibles por sesión individual o paquetes mensuales con descuento (puedes invitarlos a usar la calculadora de tarifas en la página o escribir al WhatsApp 315 887 6852 para cotizar según el grado y materia).
- Si quieren agendar o hablar con un asesor: dales el WhatsApp 315 887 6852 o el correo pipevalenciamena5@gmail.com.`;

    // Función auxiliar para consultar un modelo con límite de tiempo
    async function askGemini(modelName, timeoutMs) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            },
            contents: [{ role: "user", parts: [{ text: message }] }],
            generationConfig: {
              maxOutputTokens: 250,
              temperature: 0.7
            }
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error?.message || `HTTP ${res.status}`);
        }

        return data.candidates?.[0]?.content?.parts?.[0]?.text;
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    }

    // Intento 1: Modelo principal (límite 6.5 segundos)
    // Intento 2: Modelo ligero de respaldo si el principal está lento o saturado
    let reply = null;
    try {
      reply = await askGemini("gemini-3.8-flash", 6500);
    } catch (primaryError) {
      console.warn("Modelo principal lento o saturado, cambiando a modelo ligero:", primaryError.message);
      reply = await askGemini("gemini-3.8-flash-lite", 8000);
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: reply || "No pude generar una respuesta. Escríbenos al WhatsApp 315 887 6852." })
    };

  } catch (error) {
    console.error("Error definitivo en TutorBot:", error.message);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        reply: "Estamos recibiendo muchas consultas en este momento. Puedes cotizar o agendar directamente por WhatsApp al 315 887 6852." 
      })
    };
  }
};