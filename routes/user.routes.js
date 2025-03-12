import { Router } from 'express';
import User from '../models/User.model.js';
import { isAuthenticated } from '../middleware/jwt.middleware.js';
import bcrypt from 'bcrypt';

const router = Router();
const saltRounds = 10;

// PUT /api/users/profile - Actualizar el perfil del usuario
router.put("/users/profile", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.payload._id;
    const { name, bio, profileImage, currentPassword, newPassword } = req.body;
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
    
    // Si se proporciona una nueva contraseña, verificar la actual primero
    if (newPassword) {
      // Verificar que la contraseña actual es correcta
      if (!currentPassword) {
        return res.status(400).json({ message: "La contraseña actual es necesaria para cambiar la contraseña" });
      }
      
      const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "La contraseña actual es incorrecta" });
      }
      
      // Generar el hash para la nueva contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      updateData.password = hashedPassword;
    }
    
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
router.post('/users/:id/follow', isAuthenticated, async (req, res, next) => {
  const userToFollowId = req.params.id;
  const currentUserId = req.payload._id;

  if (userToFollowId === currentUserId) {
    return res.status(400).json({ message: "No puedes seguirte a ti mismo" });
  }

  Promise.all([
    User.findById(userToFollowId),
    User.findById(currentUserId)
  ])
    .then(([userToFollow, currentUser]) => {
      if (!userToFollow || !currentUser) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Verificar si ya sigue al usuario
      if (userToFollow.followers.includes(currentUserId)) {
        return res.status(400).json({ message: "Ya sigues a este usuario" });
      }

      // Actualizar followers y following
      return Promise.all([
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
    })
    .then(([userFollowed, userFollowing]) => {
      res.status(200).json({ message: "Usuario seguido con éxito", userFollowed, userFollowing });
    })
    .catch((err) => next(err));
});

//   User.findByIdAndUpdate(userId, { $addToSet: { following: id } }, { new: true })
//     .then(() => User.findByIdAndUpdate(id, { $addToSet: { followers: userId } }, { new: true }))
//     .then((updatedUser) => res.status(200).json(updatedUser))
//     .catch((err) => res.status(500).json(err));
// });

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

  // User.findByIdAndUpdate(userId, { $pull: { following: id } }, { new: true })
  //   .then(() => User.findByIdAndUpdate(id, { $pull: { followers: userId } }, { new: true }))
  //   .then((updatedUser) => res.status(200).json(updatedUser))
  //   .catch((err) => res.status(500).json(err));
});

// GET /api/users/:id/followers - Obtener seguidores de un usuario
router.get("/users/:id/followers", isAuthenticated, (req, res, next) => {
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
router.get("/users/:id/following", isAuthenticated, (req, res, next) => {
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

export default router;