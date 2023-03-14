const { Router } = require('express');
const router = Router();

const userController = require('../controllers/user.controller');
const { isLogged, isAdmin } = require('../middlewares/validaciones');

router.get('/', isLogged, isAdmin, userController.getAll);

router.get('/me', userController.getUserEmail);

router.get('/:id', isLogged, isAdmin, userController.getById);

// Ruta para buscar por nombre (como un like en SQL)
router.get('/buscar/:nombre', userController.getByName);

router.post('/', isLogged, isAdmin, userController.createUser);

router.put('/:id', isLogged, isAdmin, userController.updateUser);

router.delete('/:id', isLogged, isAdmin, userController.deleteUser);

module.exports = router;