// const { Router } = require('express');
// const router = Router();
// const ordenController = require('../controllers/orden.controller');
// const { isLogged, isAdmin } = require('../middlewares/validaciones');


// router.get('/', isLogged, ordenController.getAll);

// router.get('/detail/:id', isLogged, ordenController.getordenById);

// router.get('/busqueda/fechas', isLogged, ordenController.getEntreFechas);

// router.get('/misOrdenes', isLogged, async (req, res) => {      
//   try {                    
//     let ordens = [];
//     let misordens = await ordenController.getMyordens(req.user._id);          
    
//     if(misordens.result.length !== 0) {
//       ordens = misordens.result;
//     }     

//     res.render('ordens.ejs', { title: 'My Cart', user: req.user, ordens });

//   } catch (error) {
//     res.status(404).send({status:'ERROR', result: error.message}); 
//   } 
// });

// router.post('/', isLogged, ordenController.neworden);

// module.exports = router;
