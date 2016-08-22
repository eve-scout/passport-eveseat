var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , EveSeatStrategy = require('passport-eveseat').Strategy;

var EVESEAT_CLIENT_ID = "fsdfsdfs"
var EVESEAT_CLIENT_SECRET = "sdfsfsfsfsdf";
var EVESEAT_BASE_URI = "http://192.168.60.10";
var EVESEAT_REMOTE_URI = "http://localhost:" + (process.env.PORT || 3000) + "/auth/eveseat/callback";
var EVESEAT_SCOPES = "character.profile,character.roles,email";

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete EVE SeAT profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the EveSeatStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and EVE SeAT
//   profile), and invoke a callback with a user object.
passport.use(new EveSeatStrategy({
    clientID: EVESEAT_CLIENT_ID,
    clientSecret: EVESEAT_CLIENT_SECRET,
    baseURI: EVESEAT_BASE_URI,
    callbackURL: EVESEAT_REMOTE_URI,
    scope: EVESEAT_SCOPES
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's EVE SeAT profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the EVE SeAT account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}


// Configure Express

// Create a new Express application.
var app = express();
app.set('port', process.env.PORT || 3000);

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
// app.use(require('cookie-parser')());
// app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));


// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/profile', ensureAuthenticated, function(req, res){
  res.render('profile', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});


// GET /auth/eveseat
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in EVE SeAT authentication will involve
//   redirecting the user to EVE SeAT.  After authorization, EVE SeAT
//   will redirect the user back to this application at /auth/eveseat/callback
app.get('/auth/eveseat',
  passport.authenticate('eveseat'),
  function(req, res){
    // The request will be redirected to EVE SeAT for authentication, so this
    // function will not be called.
  });


// GET /auth/eveseat/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/eveseat/callback', 
  passport.authenticate('eveseat', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
  console.log('Waiting for OAuth2 Callback at', EVESEAT_REMOTE_URI);
  console.log('');
  console.log('Be sure to setup the OAuth2 client in SeAT with the following:')
  console.log('');
  console.log('Name: <any name>');
  console.log('Client ID:', EVESEAT_CLIENT_ID);
  console.log('Client Secret:', EVESEAT_CLIENT_SECRET);
  console.log('End Point:', EVESEAT_BASE_URI);
  console.log('Scopes:', EVESEAT_SCOPES)
});