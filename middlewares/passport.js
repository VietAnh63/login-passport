const User = require("../models/User");

const passport = require("passport");
//import passport local
const LocalStrategy = require("passport-local").Strategy;
//import passport facebook
const passportfb = require("passport-facebook").Strategy;
//import passport google
const passportgg = require("passport-google-oauth").OAuth2Strategy;

//236640011683-5o8rqb07gum136c64rep0e3jno2bau9g.apps.googleusercontent.com
//u3En6M7d4O0t71cEmC1tebf9
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
      clientID: "2614293668674028",
      clientSecret: "70020fd2091d72275a86af028834e96e",
      callbackURL: "http://localhost:3000/auth/fb/cb",
      profileFields: ["email", "gender", "locale", "displayName"],
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
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
        "236640011683-5o8rqb07gum136c64rep0e3jno2bau9g.apps.googleusercontent.com",
      clientSecret: "u3En6M7d4O0t71cEmC1tebf9",
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
