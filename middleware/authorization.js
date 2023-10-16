const passport = require('passport');

const checkAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err || !user) {
            // Handle the unauthorized user case here
            return res.status(401).json({ success: false, error: 'Unauthorized access' });
        }
        req.user = user;
        next();
    })(req, res, next);
};

module.exports = {
    checkAuth
}