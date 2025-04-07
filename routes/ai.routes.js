import { Router } from "express";
import { isAuthenticated } from "../middleware/jwt.middleware.js";
import * as aiController from "../controllers/ai.controller.js";

const router = Router();

// Ruta para el chatbot de recetas
router.post("/chat", isAuthenticated, aiController.chatWithRecipeAssistant);

// Ruta para obtener información de ingredientes
router.post("/ingredient-info", isAuthenticated, aiController.getIngredientInfo);

// Ruta para sugerir recetas basadas en ingredientes
router.post("/suggest-recipes", isAuthenticated, aiController.suggestRecipes);

export default router;