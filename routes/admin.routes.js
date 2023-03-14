const { Router } = require('express');
const router = Router();
const { isLogged, isAdmin } = require('../middlewares/validaciones');


router.get('/', isLogged, isAdmin, (req, res) => {
  res.render('admin.ejs', { title: 'Menu Admin', user: req.user })
})

module.exports = router;