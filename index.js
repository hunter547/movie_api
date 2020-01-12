const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  mongoose = require('mongoose'),
  Models = require('./models.js'),
  passport = require('passport'),
  cors = require('cors'),
  { check, validationResult } = require('express-validator'),
  app = express();

require('./passport.js');
require('./auth.js');

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

var allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];
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

// GET requests
app.get('/', function(req, res) {
  res.send('Welcome to my movie api!')
});
app.get('/documentation', function(req, res) {
  app.use(express.static('public'));
});
app.get('/movies', passport.authenticate('jwt', { session: false }), function(req, res) {
  Movies.find({}, '-_id')
    .populate('director', '-_id name')
    .populate('genre', '-_id name')
    .exec(function(err, movie) {
      if (err) return console.error(err);
      res.status(201).json(movie)
    });
});

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

app.get('/movies/:name', passport.authenticate('jwt', { session: false }), function(req, res) {
  Movies.findOne({ title: req.params.name }, '-_id')
    .populate('director', '-_id name')
    .populate('genre', '-_id name')
    .exec(function(err, movie) {
      if (err) return console.error(err);
      res.status(201).json(movie)
    });
});

app.get('/genres/:name', passport.authenticate('jwt', { session: false }), function(req, res) {
  Genres.findOne({ name: req.params.name }, '-_id')
    .then(function(genre) {
      res.status(201).json(genre)
    })
    .catch(function(err) {
      res.status(500).send("Error: " + err);
    })
});

app.get('/directors/:name', passport.authenticate('jwt', { session: false }), function(req, res) {
  Directors.findOne({ name: req.params.name }, '-_id')
    .then(function(director) {
      res.status(201).json(director)
    })
    .catch(function(err) {
      res.status(500).send("Error: " + err);
    })
});

// POST requests
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
        return res.status(400).send('User "' + req.body.username
          + '" already exists, please try a different one.');
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

app.post('/movies/new/', passport.authenticate('jwt', { session: false }), function(req, res) {
  Movies.findOne({ title: req.body.title })
    .then(function(movie) {
      if (movie) {
        return res.status(400).send('Movie "' + req.body.title + '" already exists, please enter a different movie.');
      }
      else {
        Movies.create({
          title: req.body.name,
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          birth_date: req.body.birth_date,
          favorite_movies: req.body.favorite_movies
        })
          .then(function(movie) {
            res.status(201).json(movie)
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
  Users.findOneAndUpdate({ username: req.params.username }, {
    $set:
    {
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
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
        res.json(updatedUser);
      }
    })
});

// DELETE requests
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
