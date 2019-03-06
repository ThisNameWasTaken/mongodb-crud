const { sanitize } = require('express-mongo-sanitize');

function middleware(options) {
  return function(req, res, next) {
    ['body', 'params', 'query', 'headers'].forEach(function(k) {
      if (req[k]) {
        req[k] = sanitize(req[k], options);
      }
    });
    next();
  };
}

module.exports = middleware;
