import { Router } from "express";
const router = Router();
import Recipe from "../models/Recipe.model.js";
import { isAuthenticated } from "../middleware/jwt.middleware.js";
import Comment from "../models/Comment.model.js";

// Middleware para prevenir el almacenamiento en caché
const preventCache = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
};

// POST /recipes - Create a new recipe
router.post("/recipes", isAuthenticated, (req, res, next) => {
  const { 
    image, 
    title, 
    ingredients, 
    vegetarian,
    vegan, 
    glutenFree, 
    lactoseFree, 
    instructions, 
    time, 
    flavor, 
    beveragePairing, 
    difficulty 
  } = req.body;
  
  // Asignar automáticamente el autor como el usuario autenticado
  const author = req.payload._id;

  Recipe.create({ 
    image, 
    title, 
    ingredients, 
    vegetarian,
    vegan, 
    glutenFree, 
    lactoseFree, 
    instructions, 
    time, 
    flavor, 
    beveragePairing, 
    difficulty, 
    author 
  })
    .then((createdRecipe) => res.status(201).json(createdRecipe))
    .catch((err) => next(err));
});

// GET /recipes - List all recipes
router.get("/recipes", preventCache, (req, res, next) => {
  // Obtenemos los parámetros de paginación de la consulta, con valores predeterminados
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;

  // Filtros
  const filter = {};
  if (req.query.vegetarian === 'true') filter.vegetarian = true;
  if (req.query.vegan === 'true') filter.vegan = true;
  if (req.query.glutenFree === 'true') filter.glutenFree = true;
  if (req.query.lactoseFree === 'true') filter.lactoseFree = true;
  
  // Calculamos el número de documentos a saltar
  const skip = (page - 1) * limit;
  
  // Primero contamos el total de recetas para calcular el número total de páginas
  Promise.all([
    Recipe.countDocuments(),
    Recipe.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("author", "name")
  ])
    .then(([total, recipes]) => {
      const totalPages = Math.ceil(total / limit);
      
      res.status(200).json({
        recipes,
        totalPages,
        currentPage: page,
        totalRecipes: total
      });
    })
    .catch((err) => next(err));
});

// GET /recipes/my-recipes - Get recipes from the logged user
router.get("/recipes/my-recipes", isAuthenticated, preventCache, (req, res, next) => {
  const userId = req.payload._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  
  // Calculamos el número de documentos a saltar
  const skip = (page - 1) * limit;
  
  Promise.all([
    Recipe.countDocuments({ author: userId }),
    Recipe.find({ author: userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("author", "name")
  ])
    .then(([total, recipes]) => {
      const totalPages = Math.ceil(total / limit);
      
      res.status(200).json({
        recipes,
        totalPages,
        currentPage: page,
        totalRecipes: total
      });
    })
    .catch((err) => next(err));
});


// GET /recipes/random - Get a random recipe
router.get("/recipes/random", preventCache, (req, res, next) => {
  Recipe.find()
    .populate("author", "name")  // Añadir populate para obtener el nombre del autor
    .then((recipes) => {
      if (recipes.length === 0) {
        return res.status(404).json({ message: "No hay recetas disponibles" });
      }
      
      const randomIndex = Math.floor(Math.random() * recipes.length);
      res.status(200).json(recipes[randomIndex]);
    })
    .catch((err) => next(err));
});

// GET /recipes/author/:id - Filter recipes by author
router.get("/recipes/author/:id", preventCache, (req, res, next) => {
  const { id } = req.params;

  Recipe.find({ author: id })
    .populate("author", "name email") // Aseguramos que el autor se popule correctamente
    .then((recipes) => res.status(200).json(recipes))
    .catch((err) => next(err));
});

// IMPORTANTE: La ruta con parámetro dinámico debe ir después de las rutas específicas
// GET /recipes/:id - Get recipe by id
router.get("/recipes/:id", preventCache, (req, res, next) => {
  const { id } = req.params;

  Recipe.findById(id)
    .populate("author", "name") // Populamos el campo author para obtener su nombre
    .then((recipe) => res.status(200).json(recipe))
    .catch((err) => next(err));
});

//POST /recipes/:id/comments - Add a comment to a recipe
router.post('/recipes/:id/comments', isAuthenticated, (req, res, next) => {
  const { id } = req.params;
  const { content } = req.body;
  const author = req.payload._id;
  
  Comment.create({content, author, recipe: id})
    .then((createdComment) => Recipe.findByIdAndUpdate(id, { $push: { comments: createdComment._id } }, { new: true }))
    .then((updatedRecipe) => res.status(201).json(updatedRecipe))
    .catch((err) => next(err));
});

//POST /recipes/:id/like - Like a recipe
router.post('/recipes/:id/like', isAuthenticated, (req, res, next) => {
  const { id } = req.params;
  const userId = req.payload._id;

  Recipe.findByIdAndUpdate(id, { $addToSet: { likes: userId } }, { new: true })
    .then((updatedRecipe) => res.status(200).json(updatedRecipe))
    .catch((err) => next(err));
});

//POST /recipes/:id/unlike - Unlike a recipe
router.post('/recipes/:id/unlike', isAuthenticated, (req, res, next) => {
  const { id } = req.params;
  const userId = req.payload._id;
  
  Recipe.findByIdAndUpdate(id, {$pull: { likes: userId }}, {new: true})
    .then((updatedRecipe) => res.status(200).json(updatedRecipe))
    .catch((err) => next(err));
});

// GET /recipes/filter - Filter recipes by ingredients, cuisine, glutenFree, lactoseFree
router.get("/recipes/filter", preventCache, (req, res, next) => {
  const { ingredients, vegetarian, vegan, glutenFree, lactoseFree, time, flavor, beveragePairing, difficulty, title, author } = req.query;
  const filter = {};

  if (title) filter.title = { $regex: title, $options: 'i' };
  if (ingredients) filter.ingredients = { $all: ingredients.split(",") };
  if (vegetarian) filter.vegetarian = vegetarian === "true";
  if (vegan) filter.vegan = vegan === "true";
  if (glutenFree) filter.glutenFree = glutenFree === "true";
  if (lactoseFree) filter.lactoseFree = lactoseFree === "true";
  if (time) filter.time = time;
  if (flavor) filter.flavor = flavor;
  if (beveragePairing) filter.beveragePairing = beveragePairing;
  if (difficulty) filter.difficulty = difficulty;
  if (author) filter.author = author;

  Recipe.find(filter)
  .then((recipes) => {
    // Agregar paginación si es necesario
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedRecipes = recipes.slice(startIndex, endIndex);
    const totalPages = Math.ceil(recipes.length / limit);
    
    res.status(200).json({
      recipes: paginatedRecipes,
      totalPages,
      currentPage: page,
      totalRecipes: recipes.length
    });
  })
    .catch((err) => next(err));
});

// PUT /recipes/:id - Update recipe by id
router.put("/recipes/:id", isAuthenticated, (req, res, next) => {
  const { id } = req.params;
  const { image, title, ingredients, vegetarian, vegan, glutenFree, lactoseFree, instructions, time, flavor, beveragePairing, difficulty } = req.body;
  
  // Verificar que el usuario es el autor de la receta
  Recipe.findById(id)
    .then(recipe => {
      if (recipe.author.toString() !== req.payload._id) {
        return res.status(403).json({ message: "No tienes permiso para editar esta receta" });
      }
      
      return Recipe.findByIdAndUpdate(id, 
        { image, title, ingredients, vegetarian, vegan, glutenFree, lactoseFree, instructions, time, flavor, beveragePairing, difficulty }, 
        { new: true }
      );
    })
    .then((updatedRecipe) => res.status(200).json(updatedRecipe))
    .catch((err) => next(err));
});

// DELETE /recipes/:id - Delete recipe by id
router.delete("/recipes/:id", isAuthenticated, (req, res, next) => {
  const { id } = req.params;

  // Verificar que el usuario es el autor de la receta
  Recipe.findById(id)
    .then(recipe => {
      if (!recipe) {
        return res.status(404).json({ message: "Receta no encontrada" });
      }
      
      if (recipe.author.toString() !== req.payload._id) {
        return res.status(403).json({ message: "No tienes permiso para eliminar esta receta" });
      }
      
      return Recipe.findByIdAndDelete(id);
    })
    .then(() => res.status(204).send())
    .catch((err) => next(err));
});

export default router;