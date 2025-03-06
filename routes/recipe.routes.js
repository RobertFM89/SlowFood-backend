import { Router } from "express";
const router = Router();
import Recipe from "../models/Recipe.model.js";

// POST /recipes - Create a new recipe
router.post("/recipes", (req, res, next) => {
  const { image, title, ingredients, cuisine, glutenFree, lactoseFree, instructions, time, flavor, beveragePairing, difficulty } = req.body;

  Recipe.create({ image, title, ingredients, cuisine, glutenFree, lactoseFree, instructions, time, flavor, beveragePairing, difficulty })
    .then((createdRecipe) => res.status(201).json(createdRecipe))
    .catch((err) => next(err));
});

// GET /recipes - List all recipes
router.get("/recipes", (req, res, next) => {
  Recipe.find()
    .then((recipes) => res.status(200).json(recipes))
    .catch((err) => next(err));
});

// GET /recipes/:id - Get recipe by id
router.get("/recipes/:id", (req, res, next) => {
  const { id } = req.params;

  Recipe.findById(id)
    .then((recipe) => res.status(200).json(recipe))
    .catch((err) => next(err));
});

// GET /recipes/filter - Filter recipes by ingredients, cuisine, glutenFree, lactoseFree
router.get("/recipes/filter", (req, res, next) => {
  const { ingredients, cuisine, glutenFree, lactoseFree, time, flavor, beveragePairing, difficulty, title, author } = req.query;
  const filter = {};

  if (title) filter.title = title;
  if (ingredients) filter.ingredients = { $all: ingredients.split(",") };
  if (cuisine) filter.cuisine = cuisine;
  if (glutenFree) filter.glutenFree = glutenFree === "true";
  if (lactoseFree) filter.lactoseFree = lactoseFree === "true";
  if (time) filter.time = time;
  if (flavor) filter.flavor = flavor;
  if (beveragePairing) filter.beveragePairing = beveragePairing;
  if (difficulty) filter.difficulty = difficulty;
  if (author) filter.author = author;

  Recipe.find(filter)
    .then((recipes) => res.status(200).json(recipes))
    .catch((err) => next(err));
});

// GET /recipes/author/:id - Filter recipes by author
router.get("/recipes/author/:id", (req, res, next) => {
  const { id } = req.params;

  Recipe.find({ author: id })
    .then((recipes) => res.status(200).json(recipes))
    .catch((err) => next(err));
});

// GET /recipes/random - Get a random recipe
router.get("/recipes/random", (req, res, next) => {
  Recipe.find()
    .then((recipes) => {
      const randomIndex = Math.floor(Math.random() * recipes.length);
      res.status(200).json(recipes[randomIndex]);
    })
    .catch((err) => next(err));
});

// PUT /recipes/:id - Update recipe by id
router.put("/recipes/:id", (req, res, next) => {
  const { id } = req.params;
  const { image, title, ingredients, cuisine, glutenFree, lactoseFree, instructions, time, flavor, beveragePairing, difficulty } = req.body;

  Recipe.findByIdAndUpdate(id, { image, title, ingredients, cuisine, glutenFree, lactoseFree, instructions, time, flavor, beveragePairing, difficulty }, { new: true })
    .then((updatedRecipe) => res.status(200).json(updatedRecipe))
    .catch((err) => next(err));
});

// DELETE /recipes/:id - Delete recipe by id
router.delete("/recipes/:id", (req, res, next) => {
  const { id } = req.params;

  Recipe.findByIdAndRemove(id)
    .then(() => res.status(204).send())
    .catch((err) => next(err));
});

export default router;