const express = require("express");
const controller = require("../controllers/user");
const passport = require("passport");
const router = express.Router();

router.post("/login", controller.login);
router.post("/registration", controller.registration);
router.get(
  "/refresh-token",
  passport.authenticate("jwt", { session: false }),  
  controller.refreshToken
);
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.getAll
);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.getById
);
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.update
);

module.exports = router;
