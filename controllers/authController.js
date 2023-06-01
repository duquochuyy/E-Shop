"use strict";

const controller = {};
const passport = require("./passport");
const models = require("../models");

controller.show = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("login", {
    loginMessage: req.flash("loginMessage"),
    reqUrl: req.query.reqUrl,
    registerMessage: req.flash("registerMessage"),
  }); // nếu trả về giao diện login khi gặp lỗi thì kèm theo cái lỗi
};

controller.login = (req, res, next) => {
  let keepSignedIn = req.body.keepSignedIn;
  let reqUrl = req.body.reqUrl ? req.body.reqUrl : "/users/my-account";
  // duy trì giõ hàng trước khi đăng nhập
  let cart = req.session.cart;

  passport.authenticate("local-login", (error, user) => {
    if (error) {
      return next(error);
    }
    if (!user) {
      return res.redirect(`/users/login?reqUrl=${reqUrl}`);
    }
    req.logIn(user, (error) => {
      if (error) {
        return next(error);
      }
      req.session.cookie.maxAge = keepSignedIn ? 24 * 60 * 60 * 1000 : null; // lưu tối đa trong 24h

      req.session.cart = cart;

      return res.redirect(reqUrl);
    });
  })(req, res, next); // hàm authenticate trả về midlle ware thực hiện tiếp nếu có
};

controller.logout = (req, res, next) => {
  let cart = req.session.cart;

  req.logout((error) => {
    if (error) {
      return next(error);
    }
    req.session.cart = cart;
    res.redirect("/");
  });
};

// khai báo middle ware để đăng nhập trước khi thực hiện một số chức năng
controller.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect(`/users/login?reqUrl=${req.originalUrl}`);
};

controller.register = (req, res, next) => {
  let reqUrl = req.body.reqUrl ? req.body.reqUrl : "/users/my-account";
  let cart = req.session.cart;
  passport.authenticate("local-register", (error, user) => {
    if (error) {
      return next(error);
    }
    if (!user) {
      return res.redirect(`/users/login?reqUrl=${reqUrl}`);
    }
    req.logIn(user, (error) => {
      if (error) {
        return next(error);
      }
      req.session.cart = cart;
      res.redirect(reqUrl);
    });
  })(req, res, next);
};

controller.showForgotPassword = (req, res) => {
  res.render("forgot-password");
};

controller.forgotPassword = async (req, res) => {
  let email = req.body.email;
  // kiểm tra email tồn tại
  let user = await models.User.findOne({ where: { email } });
  if (user) {
    // tạo link
    const { sign } = require("./jwt");
    const host = req.header("host");
    const resetLink = `${req.protocol}://${host}/users/reset?token=${sign(
      email
    )}&email=${email}`;
    // gửi mail
    const { sendForgotPasswordMail } = require("./mail");
    sendForgotPasswordMail(user, host, resetLink)
      .then((result) => {
        console.log("Email has been sent");
        return res.render("forgot-password", { done: true });
      })
      .catch((error) => {
        console.log(error.statusCode);
        return res.render("forgot-password", {
          message:
            "An error has occured when sending to your email, please check your email address",
        });
      });
  } else {
    return res.render("forgot-password", { message: "Email does not exist" });
  }
};

controller.showResetPassword = (req, res) => {
  let email = req.query.email;
  let token = req.query.token;
  let { verify } = require("./jwt");
  if (!token || !verify(token)) {
    return res.render("reset-password", { expired: true });
  } else {
    return res.render("reset-password", {email, token});
  }
};

controller.resetPassword = async (req, res) => {
  let email = req.body.email;
  let token = req.query.token; 
  let bcrypt = require('bcrypt');
  let password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8));
  await models.User.update({password}, {where: {email}})
  res.render('reset-password', {done: true});
};

module.exports = controller;
