const router = require("express").Router();
const userController = require("../Controller/userController");
const auth = require("../middleware/auth");
const authorization = require("../middleware/authorization");
//login
router.post("/login", userController.login);
router.post("/register", userController.register);
router.post("/logout", userController.logout);
router.post("/test_path", userController.test_path);
router.post("/show_id", auth, userController.show_id);
router.post("/show_role", auth, authorization, userController.show_role);
//logout
//register
module.exports = router;
