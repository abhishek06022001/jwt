const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) return res.status(400).send("No token ");
    let user = jwt.verify(token, "accessToken");
    console.log("The user is", user);
    if (!user)
      return res.status(400).send("Access Denied");
    req.user = user;
    //user has only id in this case
    //id needs protection hence we are first authenticating it
    next();
  } catch (error) {
    return res.status(500).send("Access Denied / Unauthorized request");
  }
};
module.exports = auth;
