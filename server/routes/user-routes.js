import express from 'express'
import userController from '../controllers/user-Controller'
import authController from '../controllers/auth-Controller'

const router = express.Router();

router.route('/api/users')
  // Route for list of users
  .get(userController.list)
  // Route for creating a user
  .post(userController.create)


// auth routes
router.route('/api/users/:userId')
  // Display user info
  .get(authController.requireSignin, userController.info)
  // Updates user
  .put(authController.requireSignin, userController.update)
  // Deletes user
  .delete(authController.requireSignin, authController.hasAuthorization, userController.remove)


router.param('userId', userController.userById)

export default router
