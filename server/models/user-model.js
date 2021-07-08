import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({

  // schema definitions
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    unique: 'Email already exists',
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  hashed_password: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: Date,
  salt: String
})

// Virtual field, not stored in database
// upon password creation the string will be passed into this function and encrypted and set to the hashed_password field
UserSchema.virtual('password').set(function (password) {
  this._password = password
  this.salt = this.makeSalt()
  this.hashed_password = this.encryptPassword(password)
}).get(function () {
  return this._password
})

UserSchema.methods = {
  // checks if the entered password matches the password from the database
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },
  // Generates an encrypted password from the password entered
  encryptPassword: function (password) {
    if (!password)
      return ''
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex')
    } catch (error) {
      return ''
    }
  },
  // Generates a random salt
  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  }
}


// Creates a new schema that defines structure of each document in collection.
export default mongoose.model('User', UserSchema)