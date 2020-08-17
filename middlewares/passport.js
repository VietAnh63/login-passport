const User = require("../models/User");

const passport = require("passport");
//import passport local
const LocalStrategy = require("passport-local").Strategy;
//import passport facebook
const passportfb = require("passport-facebook").Strategy;
//import passport google
const passportgg = require("passport-google-oauth").OAuth2Strategy;

//passport for local
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function (email, password, done) {
      try {
        const user = await User.findOne({ email });
        //console.log(user.password);
        if (!user) {
          return done(null, false);
        } else {
          //const checkPassword = user.password;
          if (user.password === password) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

//2590144167914873
//e298cdd710ed8b5cf6dbd5746465189e

//import passport facebook
passport.use(
  new passportfb(
    {
      clientID: "my clientId",
      clientSecret: "my clientSeret app",
      callbackURL: "http://localhost:3000/auth/fb/cb",
      profileFields: ["email", "gender", "locale", "displayName"],
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ authFacebookId: profile._json.id }, (err, user) => {
        if (err) return done(err);
        if (user) return done(null, user);
        const newUser = new User({
          authType: "facebook",
          authFacebookId: profile._json.id,
          username: profile._json.name,
          email: profile._json.email,
        });
        newUser.save((err) => {
          return done(null, newUser);
        });
      });
    }
  )
);

passport.use(
  new passportgg(
    {
      clientID:
        "my clientId",
      clientSecret: "my clientSecret app",
      followRedirects: true,
      callbackURL: "http://localhost:3000/auth/gg/cb",
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ authGoogleId: profile.id }, function (err, user) {
        //return done(err, user);
        console.log(profile);
        if (err) return done(err);
        if (user) return done(null, user);
        const newUser = new User({
          authType: "google",
          authGoogleId: profile.id,
          username: profile.displayName,
          email: profile._json.email,
        });
        newUser.save((err) => {
          return done(null, newUser);
        });
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  return done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findOne({ _id: id }, (err, user) => {
    done(null, user);
  });
});
