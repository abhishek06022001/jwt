const router = require("express").Router();
const userController = require("../Controller/userController");
//login
router.post("/login", userController.login);
router.post("/register", userController.register);
router.post("/logout", userController.logout);
router.post("/test_path", userController.test_path);
//logout
//register
module.exports = router;
