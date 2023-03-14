const { Router } = require('express');
const router = Router();
const passport = require('passport');
const ProductController = require('../controllers/product.controller')
const upload = require('../utils/multer.config');

const { isLogged, isNotLogged } = require('../middlewares/validaciones');

router.get('/', isLogged, async (req, res) => {

  let response = await ProductController.getAll();
  let productos = response.result;     

  res.render('home.ejs', { title: 'Home', user: req.user, productos });
});

router.get('/login', isNotLogged, (req, res) =>{
  res.render('login.ejs', {title: 'Login'});
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/register', isNotLogged, (req, res) =>{
  res.render('register.ejs', {title: 'Register'});
});

router.post('/register', upload.single('foto'), passport.authenticate('local-register', {
  successRedirect: '/login',
  failureRedirect: '/register',
  failureFlash: true
}));

router.get('/logout', (req, res, next) => {

  req.logout(function(err) {
    if (err) { 
      return next(err); 
    }        
    res.redirect('/login');
  });
  
});  

module.exports = router;