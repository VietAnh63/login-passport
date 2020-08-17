const express = require("express");

const router = require("express-promise-router")();

const adController = require("../controllers/admanager");

//import passport
const passport = require("passport");
require("../middlewares/passport");

router.route("/").get(adController.adManager);
router.route("/web").get(adController.client);
router
  .route("/login")
  .get(adController.login)
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      successRedirect: "/",
    })
  );

router
  .route("/auth/fb")
  .get(passport.authenticate("facebook", { scope: ["email"] }));
router.route("/auth/fb/cb").get(
  passport.authenticate("facebook", {
    failureRedirect: "/",
    successRedirect: "/",
  })
);

router.route("/auth/gg").get(
  passport.authenticate("google", {
    scope: ["email"],
  })
);
router.route("/auth/gg/cb").get(
  passport.authenticate("google", {
    failureRedirect: "/",
    successRedirect: "/",
  })
);
module.exports = router;
