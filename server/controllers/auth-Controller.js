require('dotenv').config()
import User from '../models/user-model'
import webtoken from 'jsonwebtoken'
import expressJwt from 'express-jwt'

const signin = async function (req, res) {
  try {
    let user = await User.findOne({ "email": req.body.email })
    if (!user)
      return res.status('401').json({ error: 'User not found' })
    if (!user.authenticate(req.body.password)) {
      return res.status('401').send({
        error: "Email and password don't match"
      })
    }

    const token = webtoken.sign({ _id: user._id }, process.env.JWT_SECRET)

    res.cookie('t', token, { expire: new Date() + 9999 })

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    return res.status('401').json({ error: 'Could not sign in' })
  }
}

// Clear cookie from session. Only neccassary if frontend uses cookies
const signout = async function (req, res) {
  res.clearCookie('t')
  return res.status('200').json({
    message: "Signed out"
  })
}

const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'auth'
})

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth
    && req.profile._id == req.auth._id
  if (!(authorized)) {
    return res.status('403').json({
      error: "User is not authorized"
    })
  }
  next()
}

export default { signin, signout, requireSignin, hasAuthorization }

