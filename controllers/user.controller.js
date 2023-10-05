const { isAuthenticateUser } = require("../middleware/authentication");

exports.getUserProfile = async (req, res) => {
    res.status(200).json(req.user);
}