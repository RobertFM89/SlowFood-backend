import { Router } from 'express';
import User from '../models/User.model.js';
import { isAuthenticated } from '../middleware/jwt.middleware.js';
import bcrypt from 'bcrypt';

const router = Router();
const saltRounds = 10;

// Middleware para prevenir el almacenamiento en caché
const preventCache = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
};

// Get all users
router.get('/users', preventCache, async (req, res) => {
  User.find()
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(500).json(err));
});

// Get a user by id
router.get('/users/:id', preventCache, async (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => res.status(200).json(user))
    .catch((err) => res.status(500).json(err));
});


// Follow a user
router.post('/users/:id/follow', isAuthenticated, async (req, res, next) => {
  const userToFollowId = req.params.id;
  const currentUserId = req.payload._id;

  if (userToFollowId === currentUserId) {
    return res.status(400).json({ message: "No puedes seguirte a ti mismo" });
  }

  const userToFollow = await User.findById(userToFollowId);
  const currentUser = await User.findById(currentUserId);

  if (!userToFollow || !currentUser) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  // Verificar si ya sigue al usuario
  if (userToFollow.followers.includes(currentUserId)) {
    return res.status(400).json({ message: "Ya sigues a este usuario" });
  }

  // Actualizar followers y following
  const [userFollowed, userFollowing] = await Promise.all([
    User.findByIdAndUpdate(
      userToFollowId,
      { $push: { followers: currentUserId } },
      { new: true }
    ),
    User.findByIdAndUpdate(
      currentUserId,
      { $push: { following: userToFollowId } },
      { new: true }
    )
  ]);

  res.status(200).json({ message: "Usuario seguido con éxito", userFollowed, userFollowing });
});

// Unfollow a user
router.post('/users/:id/unfollow', isAuthenticated, async (req, res, next) => {
  const userToUnfollowId = req.params.id;
  const currentUserId = req.payload._id;

  Promise.all([
    User.findById(userToUnfollowId),
    User.findById(currentUserId)
  ])
    .then(([userToUnfollow, currentUser]) => {
      if (!userToUnfollow || !currentUser) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Verificar si realmente sigue al usuario
      if (!userToUnfollow.followers.includes(currentUserId)) {
        return res.status(400).json({ message: "No sigues a este usuario" });
      }

      // Actualizar followers y following
      return Promise.all([
        User.findByIdAndUpdate(
          userToUnfollowId,
          { $pull: { followers: currentUserId } },
          { new: true }
        ),
        User.findByIdAndUpdate(
          currentUserId,
          { $pull: { following: userToUnfollowId } },
          { new: true }
        )
      ]);
    })
    .then(([userUnfollowed, userUnfollowing]) => {
      res.status(200).json({ message: "Dejaste de seguir al usuario con éxito", userUnfollowed, userUnfollowing });
    })
    .catch((err) => next(err));
});

// GET /api/users/:id/followers - Obtener seguidores de un usuario
router.get("/users/:id/followers", preventCache, isAuthenticated, (req, res, next) => {
  User.findById(req.params.id)
    .populate("followers", "name email profileImage")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.status(200).json(user.followers);
    })
    .catch((err) => next(err));
});

// GET /api/users/:id/following - Obtener a quién sigue un usuario
router.get("/users/:id/following", preventCache, isAuthenticated, (req, res, next) => {
  User.findById(req.params.id)
    .populate("following", "name email profileImage")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.status(200).json(user.following);
    })
    .catch((err) => next(err));
});

//GET /users/discover - Get users to discover (users not being followed)
router.get("/users/discover", preventCache, isAuthenticated, async (req, res, next) => {
  res.status(200).json([])
});

// PUT /api/users/profile - Actualizar el perfil del usuario
router.put("/users/profile", preventCache, isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.payload._id;
    const { name, bio, profileImage } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Preparar el objeto de actualización
    const updateData = {
      name,
      bio,
      profileImage
    };
    
    // Actualizar el usuario
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");
    
    res.status(200).json(updatedUser);
    
  } catch (error) {
    next(error);
  }
});


export default router;