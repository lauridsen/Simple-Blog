const config = require('./config');
const express = require('express');
const morgan = require('morgan');
const compress = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');

module.exports = function() {
  const app = express();

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else if (process.env.NODE_ENV === 'production') {
    app.use(compress());
  }

  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );
  app.use(bodyParser.json());
  app.use(methodOverride());

  app.use(
    session({
      saveUninitialized: true,
      resave: false,
      secret: config.sessionSecret,
    }),
  );

  app.set('views', './app/views');
  app.set('view engine', 'ejs');

  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

  require('../app/routes/index.server.routes.js')(app);
  require('../app/routes/users.server.routes.js')(app);
  require('../app/routes/blog.server.routes.js')(app);

  app.use(express.static('./public'));
  return app;
};
