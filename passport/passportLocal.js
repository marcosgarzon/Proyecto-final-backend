const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const cloudinary = require("../utils/cloudinary.config");
const UserModel = require("../models/User.model");
const { enviarMail } = require("../utils/enviarMail");
const { logger_info } = require("../logs/files/log_config");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await UserModel.findById(id).select("-password");
  done(null, user);
});

passport.use(
  "local-register",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      let user = await UserModel.findOne({ email: email });
      if (user) return done(null, false, { message: "Email ya registrado" });
      let hashedPassword = await bcrypt.hash(password, 12);
      let cloud = await cloudinary.uploader.upload(req.file.path, {
        folder: process.env.CLOUDINARY_FOLDER,
      });
      user = new UserModel();
      user.email = email;
      user.password = hashedPassword;
      user.nombre = req.body.name;
      user.direccion = req.body.direccion;
      user.edad = req.body.edad;
      user.telefono = req.body.telefono;
      user.foto = cloud.url;
      user.isAdmin = req.body.isAdmin === undefined ? "N" : "S";
      await user.save();
      let mensaje = `<div><h2>Nuevo Usuario Registrado</h2><p>Email: ${email}</p><p>Nombre: ${req.body.name}</p><p>Dirección: ${req.body.direccion}</p><p>Teléfono: ${req.body.telefono}</p><p>Edad: ${req.body.edad}</p></div>`;
      enviarMail(process.env.MAIL_NODEMAILER, "Nuevo Registro", mensaje);
      mensaje = `<div><h2>Bienvenido</h2><p>Gracias por registrarte en Ecommerce</p><a href="#">www.ecommerce.com</a></div>`;
      enviarMail(email, `Ecommerce Back, Bienvenido ${req.body.name}`, mensaje);
      logger_info.info(
        `Ruta ${req.method} - "${req.hostname}:${req.socket.localPort}${req.baseUrl}" accedida - Email: ${user.email} - User: ${user.nombre} registrado.`
      );
      done(null, user);
    }
  )
);

passport.use(
  "local-login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      let user = await UserModel.findOne({ email: email });
      if (!user) return done(null, false, { message: "Email no registrado" });
      let comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword)
        return done(null, false, { message: "Password incorrecto" });
      logger_info.info(
        `Ruta ${req.method} - "${req.hostname}:${req.socket.localPort}${req.baseUrl}" accedida - Email: ${user.email} - User: ${user.nombre} logueado.`
      );
      done(null, user);
    }
  )
);
