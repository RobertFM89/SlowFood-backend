import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const recipeSchema = new Schema(
  {
    image: {
      type: String,
      default: "https://master-7rqtwti-znj23gdadsstc.piximizer.px.at/w_645,h_430,q_80,f_cover,cx_121,cy_0,cw_2760,ch_1840,v_52d1b92e03/fileadmin/amc.info/6-Blog/en-gb/Article_15_Header_wok_Asian_spices.jpg",
    },
    title: {
      type: String,
      required: [true, "Title is required."],
    },
    ingredients: {
      type: [String],
      required: [true, "Ingredients are required."],
    },
    cuisine: {
      type: String,
      enum: ["vegetariana", "vegana", "carnivora"],
      required: [true, "Cuisine type is required."],
    },
    glutenFree: {
      type: Boolean,
      default: false,
    },
    lactoseFree: {
      type: Boolean,
      default: false,
    },
    instructions: {
      type: String,
      required: [true, "Instructions are required."],
    },
    time: {
      type: Number,
      required: [true, "Time is required."],
    },
    flavor: {
      type: String,
      enum: ["dulce", "salado", "agridulce", "picante"],
      required: [true, "Flavor is required."],
    },
    beveragePairing: {
      type: String,
      enum: ["vino blanco", "vino rosado", "vino tinto", "cerveza", "Clipper", "té", "cafe", "licor", "cocktail"],
      required: [true, "Beverage pairing is required."],
    },
    difficulty: {
      type: String,
      enum: ["facil", "media", "dificil", "masterchef"],
      required: [true, "Difficulty is required."],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required."],
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [ {type: mongoose.Schema.Types.ObjectId, ref: "Comment"} ],
  },
  {
    timestamps: true,
  }
);

const Recipe = model("Recipe", recipeSchema);

export default Recipe;