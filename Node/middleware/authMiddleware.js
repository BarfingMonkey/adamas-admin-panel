const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const token = req.headers['x-access-token']

  if (token) {
    jwt.verify(token, 'adamas project', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.json({auth: false})
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
      res.json({auth: false})
  }
  
};

module.exports = { requireAuth };