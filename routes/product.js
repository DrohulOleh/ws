const express = require("express");
const passport = require("passport");
const upload = require("../helpers/upload");
const controller = require("../controllers/product");
const router = express.Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.getAll
);

router.get(
  "/:categoryId",
  passport.authenticate("jwt", { session: false }),
  controller.getByCategoryId
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  controller.create
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  controller.update
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.delete
);

module.exports = router;
