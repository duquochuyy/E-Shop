"use strict";

const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const models = require("../models");

// định nghĩa hàm cho passport để biết lư trạng thái người dùng trong session ntn
// ham được gọi khi xác thực thành công và lưu thông tin user vào sesssion
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// hàm được gọi bởi passport.session để lấy thông tin cảu user từ db và đưa vào req.user
passport.deserializeUser(async (id, done) => {
  try {
    let user = await models.User.findOne({
      attributes: ["id", "email", "firstName", "lastName", "mobile", "isAdmin"],
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// hàm xác thực người dùng khi đăng nhập
passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email", // tên đăng nhập là email
      passwordField: "password", //
      passReqToCallback: true, // cho phép truyền req vào callback để kiểm tra thông tin user đã đăng nhập chưa
    },
    async (req, email, password, done) => {
      if (email) {
        email = email.toLowerCase(); // chuyển địa chỉ email sang kí tự thường
      }
      try {
        if (!req.user) {
          // user chưa đăng nhập thì mới xử lí
          let user = await models.User.findOne({
            where: { email },
          });
          // email chưa tồn tại
          if (!user) {
            return done(
              null,
              false,
              req.flash("loginMessage", "Email does not exist")
            );
          }
          // email ổn, check password
          if (!bcrypt.compareSync(password, user.password)) {
            // nếu mk không đúng
            return done(
              null,
              false,
              req.flash("loginMessage", "Invalid password")
            );
          }
          // đúng email và password
          return done(null, user);
        }
        // bỏ qua đăng nhập
        done(null, req.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "local-register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      if (email) {
        email = email.toLowerCase();
      }
      if (req.user) {
        // người dùng đã đăng nhập
        return done(null, req.user);
      }
      try {
        let user = await models.User.findOne({ where: { email } });
        if (user) {
          // nếu email đã tồn tại
          return done(
            null,
            false,
            req.flash("registerMessage", "Email is already taken!")
          );
        }
        user = await models.User.create({
          email: email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(8)),
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          mobile: req.body.mobile,
        });
        // thông báo là đăng kí thành công
        done(
          null,
          false,
          req.flash(
            "registerMessage",
            "You have registered successfully. Please login!!!"
          )
        );
      } catch (error) {
        done(error);
      }
    }
  )
);

module.exports = passport;
