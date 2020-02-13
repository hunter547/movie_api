var jwtSecret = 'your_jwt_secret';
var jwt = require('jsonwebtoken');
const passport = require('passport');
require('./passport.js');


function generateJWTToken(user) {
  return jwt.sign(user, jwtSecret, {
    subject: user.username, // Encoded username from the first passport.use in passport.js
    expiresIn: '7d',
    algorithm: 'HS256'
  });
}

module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user) => {
      if (!user) {
        return res.status(200).json({
          message: 'Invalid username or password.',
          user: user
        });
      }
      if (error) {
        return res.status(500).send(error)
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        var token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
}
