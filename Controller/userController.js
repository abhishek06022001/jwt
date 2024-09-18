const { path } = require("express/lib/application");
const Users = require("../Model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const userController = {
  access_token: (req, res) => {
    // call when access token has exFpired dude
    const token = req.cookies["refreshToken"];
    const user = jwt.verify(token, "refreshToken");
    const newAccessToken = createAccessToken({ id: user.id });
    const refreshToken = createRefreshToken({ id: user.id });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/access_token",
    });
    return res.status(200).json({ msg: newAccessToken });
  },
  show_role: (req, res) => {
    const role = req.user.role;
    return res.status(200).json({ msg: "Role id is" + role });
  },
  show_id: (req, res) => {
    const user_id = req.user.id;
    return res.status(200).json({ msg: "User id is" + user_id });
  },

  test_path: (req, res) => {
    // get old accesstoken and return new ACT and RFT
    // const cookie = req.cookies["refreshToken"];
    // return res.status(200).json({ refreshToken: cookie });
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Email is wrong" });
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(500).json("Error comparing passwords:", err);
        }
        if (result) {
          const accessToken = createAccessToken({ id: user._id });
          const refreshToken = createRefreshToken({ id: user._id });

          //send refreshToken to cookies to generate a new accessToken
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            path: "/access_token",
            // The cookie is sent to the server only for requests that match the path specified.
          });
          return res.status(200).json({
            msg: "Passwords match! User authenticated",
            token: accessToken,
          });
        } else {
          return res
            .status(400)
            .json({ msg: "Passwords do not match! User isnt authenticated" });
        }
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshToken");

      return res.status(200).json({ msg: "logged out" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  register: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = new Users({
        name,
        email,
        password: hashedPassword,
        role,
      });
      // made a new model object to interact with mongo db
      await newUser.save();
      return res.status(200).json({ msg: "User registered SuccessFully :)" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};
const createAccessToken = (payload) => {
  let token;
  try {
    token = jwt.sign(
      {
        id: payload.id,
      },
      "accessToken",
      { expiresIn: "1h" }
    );
    return token;
  } catch (err) {
    console.log(err);
    const error = new Error("Error! Something went wrong.");
    return error;
  }
};
const createRefreshToken = (payload) => {
  let token;
  try {
    token = jwt.sign(
      {
        id: payload.id,
      },
      "refreshToken",
      { expiresIn: "24h" }
    );
    return token;
  } catch (err) {
    console.log(err);
    const error = new Error("Error! Something went wrong.");
    return error;
  }
};
module.exports = userController;
