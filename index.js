const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  mongoose = require('mongoose'),
  Models = require('./models.js'),
  passport = require('passport'),
  cors = require('cors'),
  { check, validationResult } = require('express-validator'),
  app = express(),
  path = require('path');

require('./passport');

const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;
const Genres = Models.Genre;


// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true });
mongoose.connect('mongodb+srv://admin:admin@myflixdb-h9nol.mongodb.net/myFlixDB?retryWrites=true&w=majority', { useNewUrlParser: true });

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(cors());
auth = require('./auth.js')(app);

var allowedOrigins = ['http://localhost:8080', 'https://my-flix-api-evanoff.herokuapp.com', 'http://localhost:1234'];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
      var message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

app.use('/client', express.static(path.join(__dirname, 'client', 'dist')));
app.get('/client/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});
app.use(express.static('public'));

// GET requests
app.get('/', function(req, res) {
  res.send('Welcome to my movie api!')
});

/**
 @function Get all movies
 @description Gets all the movies in the database.
 @example
  axios({
    method: 'get',
    url: 'https://my-flix-api-evanoff.herokuapp.com/client/movies', 
    {
      headers: { Authorization: `Bearer ${token}` 
    }
})
 *@param {String} '/movies' The movies endpoint requested by the client.
 *@param {Object} jwt The bearer json web token passed into the HTTP request from the client.
 @returns {JSON} JSON object of all movies, each of which contain the movie's title, description, director, genre, image url, and featured status.
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), function(req, res) {
  Movies.find({})
    .populate('director')
    .populate('genre')
    .exec(function(err, movie) {
      if (err) return console.error(err);
      res.status(201).json(movie)
    });
});

/**
 @function Get all users
 @description Gets all the users in the database.
 @example
  axios({
    method: 'get',
    url: 'https://my-flix-api-evanoff.herokuapp.com/client/users', 
    {
      headers: { Authorization: `Bearer ${token}` 
    }
})
 *@param {String} '/users' The users endpoint requested by the client.
 *@param {Object} jwt The bearer json web token passed into the HTTP request from the client.
 @returns {JSON} JSON object containing all users, each of which contain the name, username, hashed password, email, birthday, and favorite movies
 */
app.get('/users', passport.authenticate('jwt', { session: false }), function(req, res) {
  Users.find()
    .then(function(users) {
      res.status(201).json(users)
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    })
});

/**
 @function Get a single user
 @description Gets a specific user from the database.
 @example
  axios({
    method: 'get',
    url: 'https://my-flix-api-evanoff.herokuapp.com/client/users/bob123', 
    {
      headers: { Authorization: `Bearer ${token}` 
    }
})
 *@param {String} '/users/:user' The users endpoint and specific user requested by the client.
 *@param {Object} jwt The bearer json web token passed into the HTTP request from the client.
 @returns {JSON} JSON object containing the user's name, username, hashed password, email, birthday, and favorite movies
 */
app.get('/users/:user', passport.authenticate('jwt', { session: false }), function(req, res) {
  Users.findOne({ username: req.params.user })
    .populate('favorite_movies')
    .exec(function(err, user) {
      if (err) return console.error(err)
      res.status(201).json(user)
    });
});

/**
 @function Movie in user favorites
 @description A function that returns a boolean indicating whether a movie is in a user's favorites or not.
 Good for determining if a "Add to favorites" button should be display only or clickable.
 @example
  axios({
    method: 'get',
    url: 'https://my-flix-api-evanoff.herokuapp.com/client/users/bob123/Movies/12345678', 
    {
      headers: { Authorization: `Bearer ${token}` 
    }
})
 *@param {String} '/users/:user/Movies/:MovieID' The users endpoint with a specific user and movie ID.
 *@param {Object} jwt The bearer json web token passed into the HTTP request from the client.
 @returns {Boolean} Boolean that indicates whether a movie is in a user's favorites.
 */
app.get('/users/:user/Movies/:MovieID', passport.authenticate('jwt', { session: false }), function(req, res) {
  Users.findOne({ username: req.params.user })
    .populate('favorite_movies')
    .exec(function(err, user) {
      if (err) return console.error(err)
      var inFavorites = false;
      user.favorite_movies.forEach(favorite_movie => {
        if (favorite_movie._id == req.params.MovieID) {
          inFavorites = true;
        }
      })
      res.status(201).json(inFavorites);
    });
});

/**
 @function Get a single movie
 @description Gets a specific movie in the database.
 @example
  axios({
    method: 'get',
    url: 'https://my-flix-api-evanoff.herokuapp.com/client/movies/12345678', 
    {
      headers: { Authorization: `Bearer ${token}` 
    }
})
 *@param {String} '/movies/:name' The movies endpoint with a specific movie requested by the client.
 *@param {Object} jwt The bearer json web token passed into the HTTP request from the client.
 @returns {JSON} JSON object of the movie containing the movie's title, description, director, genre, image url, and featured status.
 */
app.get('/movies/:name', passport.authenticate('jwt', { session: false }), function(req, res) {
  Movies.findOne({ title: req.params.name }, '-_id')
    .populate('director')
    .populate('genre')
    .exec(function(err, movie) {
      if (err) return console.error(err);
      res.status(201).json(movie)
    });
});

/**
 @function Get a single genre
 @description Gets a specific genre in the database.
 @example
  axios({
    method: 'get',
    url: 'https://my-flix-api-evanoff.herokuapp.com/client/genres/Drama', 
    {
      headers: { Authorization: `Bearer ${token}` 
    }
})
 *@param {String} '/genres/:name' The movies endpoint with a specific movie requested by the client.
 *@param {Object} jwt The bearer json web token passed into the HTTP request from the client.
 @returns {JSON} JSON object of the genre containing the genre's name and description.
 */
app.get('/genres/:name', passport.authenticate('jwt', { session: false }), function(req, res) {
  Genres.findOne({ name: req.params.name }, '-_id')
    .then(function(genre) {
      res.status(201).json(genre)
    })
    .catch(function(err) {
      res.status(500).send("Error: " + err);
    })
});

/**
 @function Get a single director
 @description Gets a specific director in the database.
 @example
  axios({
    method: 'get',
    url: 'https://my-flix-api-evanoff.herokuapp.com/client/directors/Quentin%20Tarantino', 
    {
      headers: { Authorization: `Bearer ${token}` 
    }
})
 *@param {String} '/directors/:name' The directors endpoint with a specific director requested by the client.
 *@param {Object} jwt The bearer json web token passed into the HTTP request from the client.
 @returns {JSON} JSON object of the director containing the director's name, picture, bio, and birthday.
 */
app.get('/directors/:name', passport.authenticate('jwt', { session: false }), function(req, res) {
  Directors.findOne({ name: req.params.name })
    .then(function(director) {
      res.status(201).json(director)
    })
    .catch(function(err) {
      res.status(500).send("Error: " + err);
    })
});

// POST requests
/**
 @function Create a user
 @description Create a user in the database. No json web token necessary, as they are a new user and will have a token assigned to them once created.
 @example
  axios({
    method: 'post',
    url: 'https://my-flix-api-evanoff.herokuapp.com/client/users', 
    {
      "name": "Bob Smith",
      "username": "bob123",
      "password": "smith123",
      "email": "bob@gmail.com",
      "birth_date": "01-01-1990"
    }

})
 *@param {String} '/users' The users endpoint requested by the client.
 *@param {JSON} user The user json object containing name, username, password, email, and birthday.
 @returns {JSON} JSON object of the new user containing the new user's name, username, hashed password, email, and birthday.
 */
app.post('/users/', [check('username', 'Username is required').isLength({ min: 5 }),
check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
check('password', 'Password is required').not().isEmpty(),
check('email', 'Email does not appear to be valid').isEmail()], function(req, res) {

  // check the validation object for errors
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  var hashedPassword = Users.hashPassword(req.body.password);

  Users.findOne({ username: req.body.username })
    .then(function(user) {
      if (user) {
        return res.status(200).json({
          user: !user,
          message: 'Username already being used.'
        });
      }
      else {
        Users.create({
          name: req.body.name,
          username: req.body.username,
          password: hashedPassword,
          email: req.body.email,
          birth_date: req.body.birth_date,
          favorite_movies: req.body.favorite_movies
        })
          .then(function() {
            Users.findOne({ username: req.body.username })
              .populate('favorite_movies', '-_id title')
              .exec(function(err, user) {
                if (err) {
                  console.error(err);
                  res.status(500).send("Error: " + err);
                } else {
                  user = JSON.parse(JSON.stringify(user, ["_id", "name", "username"
                    , "password", "email", "birth_date", "favorite_movies", "title"], 0));
                  res.status(201).json(user);
                }
              })
          })
          .catch(function(error) {
            console.error(error);
            res.status(500).send("Error: " + error);
          })
      }
    }).catch(function(error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

/**
 @function Add movie to user favorites
 @description Adds a movie to a specific user's favorites.
 @example
  axios({
      method: 'post',
      url: 'https://my-flix-api-evanoff.herokuapp.com/client/users/bob123/Movies/12345678',
      headers: { 'Authorization': `Bearer ${token}` }
})
 *@param {String} '/users/:user/Movies/:MovieID' The users endpoint with a specific user and movie ID.
 *@param {Object} jwt The bearer json web token passed into the HTTP request from the client.
 @returns {Object} Returns the new user object with name, username, hashed password, email, birthday, and new favorites.
 */
app.post('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), function(req, res) {
  Users.findOne({ username: req.params.Username })
    .then(function(user) {
      if (user) {
        var inFavorites = false;
        user.favorite_movies.forEach(favorite_movie => {
          if (favorite_movie == req.params.MovieID) {
            inFavorites = true;
          }
        });
      }
      if (!user) {
        return res.status(400).send('Username "' + req.params.Username + '" does not exist, please try another.');
      }
      else if (inFavorites) {
        return res.status(400).send(req.params.Username + ' already has this movie in their favorites.')
      }
      else {
        Users.findOneAndUpdate({ username: req.params.Username }, {
          $push: { favorite_movies: req.params.MovieID }
        }, { new: true })
          .populate('favorite_movies', '-_id title')
          .exec(function(err, user) {
            if (err) {
              console.error(err);
              res.status(500).send("Error: " + err);
            } else {
              user = JSON.parse(JSON.stringify(user, ["_id", "name", "username"
                , "password", "email", "birth_date", "favorite_movies", "title"], 0));
              res.json(user);
            }
          })
      }
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// PUT requests

/**
@function Update a user
@description Update a user's information in the database. If trying to update a username that isn't their, 
a validation error will be thrown.
@example
 axios({
      method: 'put',
      url: 'https://my-flix-api-evanoff.herokuapp.com/client/users/bob123',
      headers: { 'Authorization': `Bearer ${token}` },
      data: {
        "name" : "Bob Smith",
        "username": "bob123",
        password: "smith123",
        "email": "bobsmith@gmail.com",
        birth_date: "01-01-1990"
      }

})
*@param {String} '/users/:username' The users endpoint and specific username requested by the client.
*@param {Object} jwt The bearer json web token passed into the HTTP request from the client.
*@param {JSON} user The user json object containing the updated name, username, password, email, and/or birthday.
@returns {JSON} JSON object containing the updated name, username, hashed password, email, and/or birthday for the user.
*/
app.put('/users/:username', passport.authenticate('jwt', { session: false }),
  [check('username', 'Username is required').isLength({ min: 5 }),
  check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('password', 'Password is required').not().isEmpty(),
  check('email', 'Email does not appear to be valid').isEmail()], function(req, res) {

    // check the validation object for errors
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    var hashedPassword = Users.hashPassword(req.body.password);

    Users.findOne({ username: req.body.username })
      .then(function(user) {
        if (req.body.username !== req.params.username && user) {
          return res.status(200).json({
            user: !user,
            message: 'Username already being used.'
          });
        }
        else {
          Users.findOneAndUpdate({ username: req.params.username }, {
            $set:
            {
              name: req.body.name,
              username: req.body.username,
              password: hashedPassword,
              email: req.body.email,
              birth_date: req.body.birth_date
            }
          }, { new: true })
            .populate('favorite_movies', '-_id title')
            .exec(function(err, updatedUser) {
              if (err) {
                console.error(err);
                res.status(500).send("Error " + err);
              } else {
                updatedUser = JSON.parse(JSON.stringify(updatedUser, ["_id", "name", "username"
                  , "password", "email", "birth_date", "favorite_movies", "title"], 0));
                res.status(201).json(updatedUser);
              }
            })
        }
      })
      .catch(function(err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      })
  });

// DELETE requests

/**
 @function Delete a movie from user favorites
 @description Removes a movie to from a specific user's favorites.
 @example
  axios({
      method: 'delete',
      url: 'https://my-flix-api-evanoff.herokuapp.com/client/users/bob123/Movies/12345678',
      headers: { 'Authorization': `Bearer ${token}` }
})
 *@param {String} '/users/:user/Movies/:MovieID' The users endpoint with a specific user and movie ID.
 *@param {Object} jwt The bearer json web token passed into the HTTP request from the client.
 @returns {Object} Returns the new user object with name, username, hashed password, email, birthday, and new favorites (if any).
 */
app.delete('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), function(req, res) {
  Users.findOneAndUpdate({ username: req.params.Username }, {
    $pull: { favorite_movies: req.params.MovieID }
  }).populate('favorite_movies', 'title')
    .exec(function(err, user) {
      if (err) {
        console.error(err);
        res.status(400).send("Error: " + err);
      }
      if (user) {
        var foundMovie = 0;
        user.favorite_movies.forEach(favorite_movie => {
          if (favorite_movie._id == req.params.MovieID) {
            foundMovie = 1;
            res.status(200).send(favorite_movie.title
              + ' was removed from ' + req.params.Username + '\'s favorites.');
          }
        })
        if (foundMovie === 0) {
          res.status(400).send(req.params.MovieID + ' was not found in ' + req.params.Username + '\'s favorites.');
        }
      } else {
        res.status(400).send(req.params.MovieID + ' was not found in ' + req.params.Username + '\'s favorites.');
      }
    })
});

/**
 @function Delete a user
 @description Removes a specific user from the database.
 @example
    axios({
      method: 'delete',
      url: 'https://my-flix-api-evanoff.herokuapp.com/client/users/bob123',
      headers: { 'Authorization': `Bearer ${token}` }
})
 *@param {String} '/users/:user' The users endpoint with a specific user.
 *@param {Object} jwt The bearer json web token passed into the HTTP request from the client.
 @returns {String} Returns a string indicating the user has been deleted.
 */
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), function(req, res) {
  Users.findOneAndRemove({ username: req.params.Username })
    .then(function(user) {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});


app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Error, please read the console for more details');
});

// listen for requests
var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function() {
  console.log("Listening on Port 3000");
});
