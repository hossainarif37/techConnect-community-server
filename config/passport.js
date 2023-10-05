const User = require('../models/user.model');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');


passport.use(
    new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false);
            }
            // Verify user password
            bcrypt.compare(password, user.password, function (err, result) {
                if (result) {
                    return done(null, user);
                } else {
                    return done(err, user, { passwordError: true });
                }
            });
        } catch (error) {
            return done(error);
        }
    }
    ));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
    try {
        const user = await User.findById(_id);
        done(null, user);
    } catch (error) {
        done(error, false);
    }
});