const passport = require('passport');
const User = require("../models/user-model");
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});
passport.use(new FacebookStrategy({
    clientID: '1934935630146191',
    clientSecret: 'ed7052d9bbaebfa53b0ce911b062ffec',
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email'],
    proxy: true
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile._json.picture.data.url)
    User.findOne({ fbId: profile.id })
      .then(user => {
        if (user) {
          done(null, user);
        } else {
          const newUser = new User({
            fbId: profile.id,
            userName: profile.displayName,
            avatar:profile._json.picture.data.url

          })
            .save()
            .then(user => {
              done(null, user);
            });
        }
      })
  }
));
