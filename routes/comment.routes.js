import { Router } from 'express';
const router = Router();
import Comment from '../models/Comment.model.js';
import { isAuthenticated } from '../middleware/jwt.middleware.js';

//POST /comments - Create a new comment
router.post('/comments', isAuthenticated, (req, res, next) => {
  const { content, recipeId } = req.body;
  const author = req.payload._id;

  Comment.create({content, author, recipe: recipeId})
    .then((createdComment) => res.status(201).json(createdComment))
    .catch((err) => next(err));
});

//PUT /comments/:id - Edit a comment
router.put('/comments/:id', isAuthenticated, (req, res, next) => {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.payload._id;

    Comment.findById(id)
        .then((comment) => {
            if(!comment) {
                res.status(404).json({ message: 'Comment not found' });
                return;
            }

            if(comment.author.toString() !== userId) {
                res.status(403).json({ message: 'Unauthorized' });
                return;
            }

            return Comment.findByIdAndUpdate(id, { content }, { new: true });
        })
        .then((updatedComment) => res.status(200).json(updatedComment))
        .catch((err) => next(err));
});

//DELETE /comments/:id - Delete a comment
router.delete('/comments/:id', isAuthenticated, (req, res, next) => {
    const { id } = req.params;
    const userId = req.payload._id;

    Comment.findById(id)
        .then((comment) => {
            if(!comment) {
                res.status(404).json({ message: 'Comment not found' });
                return;
            }

            if(comment.author.toString() !== userId) {
                res.status(403).json({ message: 'Unauthorized' });
                return;
            }

            return Comment.findByIdAndDelete(id);
        })
        .then(() => res.status(204).json())
        .catch((err) => next(err));
})

export default router;