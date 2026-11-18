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

    // Controlador para evitar que la petición se quede colgada más de 9 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: message }] }]
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const data = await response.json();

    if (!response.ok) {
      console.error("Error de Google API:", data);
      return { 
        statusCode: 200, 
        body: JSON.stringify({ reply: "El servicio de IA está experimentando alta demanda temporalmente. Inténtalo de nuevo en unos segundos." }) 
      };
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo obtener respuesta del modelo.";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    console.error("Error en la función:", error);
    const isTimeout = error.name === 'AbortError';
    const errorMessage = isTimeout 
      ? "El servidor tardó demasiado en responder debido a tráfico alto. Por favor, prueba otra vez." 
      : "Error interno: " + error.message;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: errorMessage })
    };
  }
};