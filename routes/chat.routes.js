const { Router } = require('express');
const router = Router();
const chatController = require('../controllers/chat.controller');
const { isLogged, isAdmin } = require('../middlewares/validaciones');


router.get('/', isLogged, (req,res) => {
  res.render('chat.ejs', { title: 'Chat Page', user: req.user } )
});

router.get('/admin', isLogged, isAdmin, (req,res) => {
  res.render('chat-admin.ejs', { title: 'Chat Page', user: req.user } )
});

router.get('/users', isLogged, isAdmin, chatController.getListaUsuarios)

router.get('/mensajes/:userId', isLogged, chatController.getUserMensajes);

module.exports = router;