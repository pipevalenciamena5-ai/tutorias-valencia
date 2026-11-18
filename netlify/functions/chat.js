exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const { message } = JSON.parse(event.body || "{}");
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Falta GEMINI_API_KEY en las variables de entorno");
      return { statusCode: 500, body: JSON.stringify({ reply: "Falta configurar la clave de Gemini en Netlify." }) };
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: message }] }]
      })
    });

    const data = await response.json();
    console.log("Respuesta de Google API:", JSON.stringify(data));

    if (!response.ok) {
      return { statusCode: 500, body: JSON.stringify({ reply: "Error de Google: " + (data.error?.message || response.status) }) };
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo obtener respuesta del modelo.";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    console.error("Error en la función:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Error interno: " + error.message })
    };
  }
};