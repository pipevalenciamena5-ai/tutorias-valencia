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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;
    const payload = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: message }] }]
      })
    };

    let response;
    let data;
    let retries = 3;
    let delay = 1000;

    // Lógica para reintentar automáticamente si Google devuelve 503 (alta demanda)
    for (let i = 0; i < retries; i++) {
      response = await fetch(url, payload);
      data = await response.json();

      if (response.status === 503 && i < retries - 1) {
        console.warn(`Intento ${i + 1} fallido por alta demanda (503). Reintentando en ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Espera exponencial
        continue;
      }
      break;
    }

    console.log("Respuesta de Google API:", JSON.stringify(data));

    if (!response.ok) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ reply: "El servidor de IA está ocupado en este momento debido a alta demanda. Por favor, intenta enviar tu mensaje de nuevo en unos segundos." }) 
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
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Error interno: " + error.message })
    };
  }
};