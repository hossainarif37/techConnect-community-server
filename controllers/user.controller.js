const { isAuthenticateUser } = require("../middleware/authorization");

exports.getUserProfile = async (req, res) => {
    res.status(200).json(req.user);
}