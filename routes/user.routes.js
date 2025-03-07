import { Router } from 'express';
const router = Router();
import User from '../models/User.model.js';
import { isAuthenticated } from '../middleware/jwt.middleware.js';


// Get all users
router.get('/users', async (req, res) => {
  User.find()
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(500).json(err));
});

// Get a user by id
router.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => res.status(200).json(user))
    .catch((err) => res.status(500).json(err));
});


// Follow a user
router.post('/users/:id/follow', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const userId = req.payload._id;

  User.findByIdAndUpdate(userId, { $addToSet: { following: id } }, { new: true })
    .then(() => User.findByIdAndUpdate(id, { $addToSet: { followers: userId } }, { new: true }))
    .then((updatedUser) => res.status(200).json(updatedUser))
    .catch((err) => res.status(500).json(err));
});

// Unfollow a user
router.post('/users/:id/unfollow', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const userId = req.payload._id;

  User.findByIdAndUpdate(userId, { $pull: { following: id } }, { new: true })
    .then(() => User.findByIdAndUpdate(id, { $pull: { followers: userId } }, { new: true }))
    .then((updatedUser) => res.status(200).json(updatedUser))
    .catch((err) => res.status(500).json(err));
});

export default router;