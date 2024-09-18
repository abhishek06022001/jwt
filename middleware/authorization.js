const jwt = require("jsonwebtoken");
const Users = require("../Model/userModel");
const authorization = async (req, res, next) => {
  try {
    const id = req.user.id;
    const user = await Users.findOne({ _id: id });
    if (user.role == 0) {
      return res.status(401).json({ msg: "Role is 0 access denied" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(501).send("Error 500 Access Denied / Unauthorized request");
  }
};
module.exports = authorization;
