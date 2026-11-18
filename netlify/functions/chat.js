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

    const systemPrompt = `Eres TutorBot, el asistente virtual oficial de Tutorías Valencia (liderado por Andrés Felipe Valencia Mena).
Tu función es responder dudas sobre horarios, materias, tarifas, metodología y cómo reservar sesiones.
Reglas estrictas:
- NUNCA resuelvas tareas, exámenes ni ejercicios académicos; explica que nuestro enfoque es enseñar paso a paso para que el estudiante domine el tema.
- Sé amable, directo, profesional y breve (máximo 3-4 líneas por respuesta).
- Si preguntan por precios/tarifas: explica que manejamos planes flexibles por sesión individual o paquetes mensuales con descuento (escribir al WhatsApp 315 887 6852 o correo pipevalenciamena5@gmail.com para cotizar según el grado y materia).`;

    async function callGemini(model) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: message }] }],
          generationConfig: { maxOutputTokens: 250, temperature: 0.7 }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || `HTTP ${res.status}`);
      }

      return data.candidates?.[0]?.content?.parts?.[0]?.text;
    }

    let reply = null;
    try {
      // Intento principal con gemini-3.8-flash
      reply = await callGemini("gemini-3.8-flash");
    } catch (primaryErr) {
      console.warn("Fallo el modelo principal, intentando con respaldo gemini-2.5-flash:", primaryErr.message);
      // Respaldo con un modelo existente y verificado
      reply = await callGemini("gemini-2.5-flash");
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: reply || "Escríbenos al WhatsApp 315 887 6852 para ayudarte con tu reserva." })
    };

  } catch (error) {
    console.error("Error definitivo en TutorBot:", error.message);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        reply: "Hola. En este momento tenemos alta demanda en el sistema de IA, pero puedes cotizar o agendar tu tutoría directamente por WhatsApp al 315 887 6852." 
      })
    };
  }
};