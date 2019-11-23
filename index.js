const express = require('express'),
  morgan = require('morgan');

const app = express();

app.use(morgan('common'));

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

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Error, please read the console for more details');
});

// listen for requests
app.listen(8080, () =>
  console.log('Listening on port 8080.')
);
