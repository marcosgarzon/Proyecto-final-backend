const validationProductInput = (req, res, next) => {
  const { nombre, precio, stock } = req.body;
  if (!nombre || !precio || !stock || precio <= 0 || stock <= 0) {
    return res.status(404).send({
      status: "Error",
      result: "Faltan datos o son incorrectos",
    });
  }
  next();
};

const isLogged = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
};

const isNotLogged = (req, res, next) => {
  if (!req.isAuthenticated()) return next();
  res.redirect("/");
};

const isAdmin = (req, res, next) => {
  if (req.user.isAdmin === "S") return next();
  res.redirect("/");
};

module.exports = {
  validationProductInput,
  isLogged,
  isNotLogged,
  isAdmin,
};
