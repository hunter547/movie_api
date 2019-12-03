const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require("body-parser"),
  uuid = require("uuid");

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

let bestMovies = [{
  movie : 'Pulp Fiction'
},
{
  movie : 'Fight Club'
},
{
  movie : 'The Matrix'
},
{
  movie : 'Inception'
},
{
  movie : 'The Prestige'
},
{
  movie : 'Interstellar'
},
{
  movie : 'Ex Machina'
},
{
  movie : 'Ocean\'s Eleven'
},
{
  movie : 'Edward Scissorhands'
},
{
  movie : 'The Conjuring'
}];

var users = [{ name: 'John Smith' }];

// GET requests
app.get('/', function(req, res) {
  res.send('Welcome to my movie api!')
});
app.get('/documentation', function(req, res) {
  app.use(express.static('public'));
});
app.get('/movies', function(req, res) {
  res.json(bestMovies);
});
app.get('/users', function(req, res) {
  res.json(users);
})
app.get('/movies/:name', function(req, res) {
  res.json(bestMovies.find(( movie ) =>
    { return movie.movie === req.params.name }));
});
app.get('/genres/:name', function(req, res) {
  res.send('Request for information about the ' + req.params.name + ' genre, which explains its relative description and movies.');
});
app.get('/directors/:name', function(req, res) {
  res.send('Information about director ' + req.params.name + '\'s bio, birth year, and death year (if applicable) has been requested.');
});

// POST requests
app.post('/users/new/:name', function(req, res) {
    var newUser = { name : req.params.name };
    users.push(newUser);
    res.send('Created a new user ' + req.params.name);
});
app.post('/movies/new/:name', function(req, res) {
  res.send('New movie "' + req.params.name + '" was added to your favorites.');
});

// PUT requests
app.put('/users/update/:name', function(req, res) {
  res.send('Updated user ' + req.params.name + ' successfully.');
});
app.put('/users/update/:oldname/:newname', function(req, res) {
  users.find(( user ) => {
    if (user.name === req.params.oldname) {
      user.name = req.params.newname;
    }});
    res.send('User formally known as ' + req.params.oldname + ', is now ' + req.params.newname);
  });

// DELETE requests
app.delete('/movies/delete/:name', function(req, res) {
  res.send('The movie "' + req.params.name + '" was removed from your favorites.');
});
app.delete('/users/delete/:name', function(req, res) {
  res.send('The user ' + req.params.name + ' has been deregistered.')
});


app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Error, please read the console for more details');
});

// listen for requests
app.listen(8080, () =>
  console.log('Listening on port 8080.')
);
