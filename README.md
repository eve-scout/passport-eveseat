# passport-eveseat

[Passport](http://passportjs.org/) strategy for authenticating with [EVE SeAT](http://eve-seat.github.io/)
using the OAuth 2.0 API.

This module lets you authenticate using EVE SeAT in your Node.js applications.
By plugging into Passport, SeAT authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install eve-scout/passport-eveseat

## Usage

#### Create an Application

Before using `passport-eveseat`, you must register your application with
SeAT, through the admin panel.

You will also need to configure an Endpoint redirect URI (`callbackURL`) and scopes your application has access to.

#### Configure Strategy

The SeAT authentication strategy authenticates users using a SeAT
account and OAuth 2.0 tokens.  The clientID and clientSecret obtained when creating an
application are supplied as options when creating the strategy.  The strategy
also requires a `verify` callback, which receives the access token and optional
refresh token, as well as `profile` which contains the authenticated user's
SeAT profile.  The `verify` callback must call `cb` providing a user to
complete authentication.

```js
passport.use(new EveSeatStrategy({
    clientID: EVESEAT_CLIENT_ID,
    clientSecret: EVESEAT_CLIENT_SECRET,
    baseURI: EVESEAT_BASE_URI,
    callbackURL: "http://localhost:3000/oauth2/callback"
    scope: "character.profile,character.roles,email"
  },
  function(accessToken, refreshToken, profile, cb) {
    return done(null, profile);
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'eveseat'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.get('/auth/eveseat',
  passport.authenticate('eveseat'));

app.get('/auth/eveseat/callback',
  passport.authenticate('eveseat', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```

## Example

For a working example refer to examples/login.

To demo, complete the following from the command line.

```bash
$ cd examples/login
$ npm install
$ node app.js
```

Follow instructions from the output and browse to http://localhost:3000

## Tests

The test suite is located in the `test/` directory.  All new features are
expected to have corresponding test cases.  Ensure that the complete test suite
passes by executing:

```bash
$ make test
```

## Coverage

The test suite covers 100% of the code base.  All new feature development is
expected to maintain that level.  Coverage reports can be viewed by executing:

```bash
$ make test-cov
$ make view-cov
```

## Credits

  - [Johnny Splunk](http://github.com/johnnysplunk)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2016 Johnny Splunk of EVE-Scout <[https://twitter.com/eve_scout](https://twitter.com/eve_scout)>