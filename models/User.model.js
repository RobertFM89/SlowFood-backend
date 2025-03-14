import { Schema, model } from "mongoose";
import mongoose from "mongoose";

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: String,
      required: [true, "Username is required."],
    },
    profileImage: {
      type: String,
      default: "https://imgs.search.brave.com/CNHD6HV54_3IuaMcJNjb007KmfsM9RqcGx2d5G1xpoA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/Zm90by1ncmF0aXMv/dmlzdGEtZnJvbnRh/bC1jb2NpbmFyLXBy/ZXBhcmFuZG8tY29t/aWRhLWRpc2VuYW5k/by1jb21pZGEtZGVu/dHJvLXBsYWNhLWZy/aXR1cmEtY29taWRh/LWNhcm5lXzE0MDcy/NS0yNjAxMi5qcGc_/c2VtdD1haXNfaHli/cmlk",
    },
    bio: {
      type: String,
      default: "Maestro del fuego y domador de sartenes, un artista culinario transforma ingredientes comunes en delicias legendarias (o en experimentos dignos de un extintor). Mi superpoder es picar cebolla sin llorar... bueno, casi. Capaz de hacer una obra maestra con lo que queda en la nevera, siempre y cuando no me lo coma antes. Si me ves con cara de preocupación, probablemente se me quemó algo... otra vez.",
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }]
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

export default User;
