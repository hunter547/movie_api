const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var movieSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre' },
  director: { type: mongoose.Schema.Types.ObjectId, ref: 'Director' },
  imageurl: String,
  featured: Boolean
});

var userSchema = mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birth_date: Date,
  favorite_movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

var directorSchema = mongoose.Schema({
  name: { type: String, required: true },
  imageurl: String,
  bio: { type: String, required: true },
  birthday: Date
});

var genreSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }
});

var Movie = mongoose.model('Movie', movieSchema);
var User = mongoose.model('User', userSchema);
var Director = mongoose.model('Director', directorSchema);
var Genre = mongoose.model('Genre', genreSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Director = Director;
module.exports.Genre = Genre;
