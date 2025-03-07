import {Schema, model} from "mongoose";
import mongoose from "mongoose";

const commentSchema = new Schema(
    {
        content: {type: String, required: [true, "Content is required."]},
        author: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "Author is required."]},
        recipe: {type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: [true, "Recipe is required."]}

},
    {
        timestamps: true,
    }
);

const Comment = model ("Comment", commentSchema);
export default Comment;