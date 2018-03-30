const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    index: true,
    match: /.+\@.+\..+/,
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    validate: [
      function(password) {
        return password.length >= 6;
      },
      'Oops! Password should be longer',
    ],
  },
  salt: {
    type: String,
  },
  provider: {
    type: String,
    required: 'Provider is required',
  },
  providerId: String,
  providerData: {},
  role: {
    type: String,
    enum: ['Admin', 'Owner', 'User'],
  },
  website: {
    type: String,
    get: function(url) {
      if (!url) {
        return url;
      } else {
        if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
          url = 'http://' + url;
        }
        return url;
      }
    },
    set: function(url) {
      if (!url) {
        return url;
      } else {
        if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
          url = 'http://' + url;
        }
        return url;
      }
    },
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.statics.findOneByUsername = function(username, callback) {
  this.findOne({ username: new RegExp(username, 'i') }, callback);
};

UserSchema.pre('save', function(next) {
  if (this.password) {
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }
  next();
});
UserSchema.methods.hashPassword = function(password) {
  return crypto
    .pbkdf2Sync(password, this.salt, 10000, 64, 'sha512')
    .toString('base64');
};
UserSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password);
};
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
  var possibleUsername = username + (suffix || '');
  this.findOne(
    {
      username: possibleUsername,
    },
    (err, user) => {
      if (!err) {
        if (!user) {
          callback(possibleUsername);
        } else {
          return this.findUniqueUsername(username, (suffix || 0) + 1, callback);
        }
      } else {
        callback(null);
      }
    },
  );
};

//Create custom static method
//Find one by username (Learning note: Can be accessed in the controller by User.findOneByUsername))

//Create custom instance method
//Check if this.password === password (Learning note: can be used in the controller by user.authenticate('password'))
// UserSchema.methods.authenticate = function(password) {
//   return this.password === password;
// };

//Create virtual field for full name
// First method for getting fullname
// Second method for setting the fullname to each field (Learning note: Can be used to help front-end to only use one field for name as an example)
// UserSchema.virtual("fullName")
//   .get(function() {
//     return this.firstName + " " + this.lastName;
//   })
//   .set(function() {
//     const splitName = fullName.split(" ");
//     this.firstName = splitName[0] || "";
//     this.lastName = splitName[1] || "";
//   });

//enable getter, setter and virtuals
UserSchema.set('toJSON', { getters: true, setters: true, virtuals: true });

//Use model for user
mongoose.model('User', UserSchema);
