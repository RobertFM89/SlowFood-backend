import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializar la API de Gemini con la clave API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Obtener una instancia del modelo
/*const getModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-pro" });
};*/

const getModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-pro-latest" });
};

// Manejar las consultas de recetas
export const chatWithRecipeAssistant = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    
    console.log("Mensaje recibido:", message);
    console.log("Historial recibido:", JSON.stringify(history));
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: "El mensaje es requerido y debe ser un texto" 
      });
    }

    const model = getModel();
    
    // Si no hay historial, simplemente enviamos el mensaje directamente
    if (history.length === 0) {
      const result = await model.generateContent(`Eres un asistente culinario experto. ${message}`);
      const response = result.response.text();
      
      return res.status(200).json({ 
        success: true, 
        data: response
      });
    }
    
    // Si hay historial, usamos el método de chat
    try {
      const chat = model.startChat({
        history: history,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      });
      
      const result = await chat.sendMessage(message);
      const response = result.response.text();

      res.status(200).json({ 
        success: true, 
        data: response
      });
    } catch (error) {
      console.error("Error en chat con historial:", error);
      
      // Si falla con historial, intentamos sin historial como fallback
      const result = await model.generateContent(`Eres un asistente culinario experto. ${message}`);
      const response = result.response.text();
      
      res.status(200).json({ 
        success: true, 
        data: response
      });
    }
  } catch (error) {
    console.error("Error en IA Assistant:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al procesar tu solicitud",
      error: error.message 
    });
  }
};

// Función para obtener información sobre ingredientes específicos
export const getIngredientInfo = async (req, res) => {
  try {
    const { ingredient } = req.body;
    
    if (!ingredient || typeof ingredient !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: "Se requiere especificar un ingrediente válido" 
      });
    }

    const model = getModel();
    
    const prompt = `Dame información detallada sobre este ingrediente culinario: ${ingredient}.
      Incluye:
      1. Propiedades nutricionales principales
      2. Usos comunes en la cocina
      3. Posibles sustitutos si alguien no lo tiene disponible
      4. Consejos para seleccionar, almacenar y cómo saber si está fresco
      5. Algunas combinaciones de sabores que funcionan bien con este ingrediente

      Formato la respuesta en párrafos claros y concisos.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.status(200).json({ 
      success: true, 
      data: response 
    });
  } catch (error) {
    console.error("Error en Información de Ingredientes:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al obtener información del ingrediente",
      error: error.message 
    });
  }
};

// Sugerir recetas basadas en ingredientes
export const suggestRecipes = async (req, res) => {
  try {
    const { ingredients, preferences = {} } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "La lista de ingredientes es requerida y debe ser un array" 
      });
    }

    const model = getModel();
    
    // Construir texto de restricciones dietéticas
    const dietaryRestrictions = [];
    if (preferences.vegetarian) dietaryRestrictions.push("vegetariana");
    if (preferences.vegan) dietaryRestrictions.push("vegana");
    if (preferences.glutenFree) dietaryRestrictions.push("sin gluten");
    if (preferences.lactoseFree) dietaryRestrictions.push("sin lactosa");
    
    const restrictionsText = dietaryRestrictions.length > 0 
      ? `La receta debe ser ${dietaryRestrictions.join(", ")}.` 
      : "";
    
    const prompt = `Sugiere 3 recetas que puedo preparar con estos ingredientes: ${ingredients.join(", ")}. 
    ${restrictionsText}
    
    Para cada receta, proporciona:
    1. Nombre de la receta
    2. Lista corta de ingredientes (indicando cuáles de los disponibles usar)
    3. Breve descripción del proceso de preparación
    4. Dificultad estimada (fácil, media o difícil)
    5. Tiempo aproximado de preparación

    Si necesito ingredientes adicionales fundamentales, indícalo, pero enfócate en usar principalmente los ingredientes listados.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.status(200).json({ 
      success: true, 
      data: response 
    });
  } catch (error) {
    console.error("Error en Sugerencia de Recetas:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al generar sugerencias de recetas",
      error: error.message 
    });
  }
};