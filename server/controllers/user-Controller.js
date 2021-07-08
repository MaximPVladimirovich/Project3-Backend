import User from '../models/user-model'
import extend from 'lodash/extend'
import errorHandler from '../helpers/database-errorHandle'


// when express app get a post request in from route '/api/users' this function will run
// Creates a user
const create = async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    return res.status(200).json({
      message: "Successfully signed up!"
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

// This will be called to fetch and load the user into the request object in routes '/api/users/:userId'
const userById = async function (req, res, next, id) {
  try {
    let user = await User.findById(id)
    if (!user)
      return res.status('400').json({
        error: 'User not found'
      })
    req.profile = user
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve user"
    })
  }
}

// Retreives user info and sets sensitive information to undefined
const info = async function (req, res) {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}

// Find all users in database and returns the users with the selected properties.
const list = async function (req, res) {
  try {
    let users = await User.find().select('name email updated created')
    res.json(users)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

// Gets user info from profile then uses lodash to use changes from request body to update
const update = async function (req, res) {
  try {
    let user = req.profile
    user = extend(user, req.body)
    user.updated = Date.now()
    await user.save()
    user.hashed_password = undefined
    user.salt = undefined
    res.json(user)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

// Loads users then removes user with the remove() function
const remove = async function (req, res) {
  try {
    let user = req.profile
    let deletedUser = await user.remove()
    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
    res.json(deletedUser)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}



export default { create, list, info, update, remove, userById }