const { Router } = require('express');
const router = Router();
const CartController = require('../controllers/cart.controller');
const { isLogged } = require('../middlewares/validaciones');


router.get('/', isLogged, async (req, res) => {        

  let response = await CartController.getMyCart(req.user);
  let cantidad = response.cantidad;
  let carrito = response.carrito;      
  let total = response.total;

  res.render('cart.ejs', { title: 'My Cart', user: req.user, carrito, cantidad, total }); 
})

router.get('/cant', isLogged, async (req, res) => {  
  
  try {    
    let response = await CartController.getMyCart(req.user);          

    return res.status(200).send({status: response.status, result: response.carrito, cantidad: response.cantidad});     

  } catch (error) {
    return res.status(404).send({status:'ERRORss', result: error.message});
  }  
})

router.get('/:id/productos', async (req, res) => {

  let { id } = req.params;

  try {    
    let result = await CartController.getById(id);    
    return res.status(200).send(result); 
    
  } catch (error) {
    return res.status(404).send({status:'ERROR', result: error.message});
  }
});

router.post('/', async (req, res) => {  
  let { producto } = req.body;         

  try {        
    let result = await CartController.createCart(producto, req.user._id);       
    return res.status(200).send(result); 
    
  } catch (error) {
    return res.status(404).send({status:'ERROR', result: error.message}); 
  }

});

router.delete('/:id', async (req, res) => {

  let { id } = req.params;  
  try {
    
    let result = await CartController.delete(id);            
    return res.status(200).send(result);  

  } catch (error) {
    return res.status(404).send({status:'ERROR', result: error.message});
  }
});

router.post('/:id/productos', async (req, res) => {

  let { id } = req.params;
  let { producto } = req.body;
  
  try {
    
    let result = await CartController.addProductToCart(id, producto)
    return res.status(200).send(result);

  } catch (error) {
    return res.status(404).send({status:'ERROR', result: error.message}); 
  }
});

router.delete('/:id_cart/productos/:id_prod', async (req, res) => {
  
  let { id_cart, id_prod } = req.params;

  try {    
    
    let result = await CartController.deleteProductFromCart(id_cart, id_prod);
    return res.status(200).send(result);

  } catch (error) {
    return res.status(404).send({status:'ERROR', result: error.message});
  }  
}); 

router.get('/micarrito', isLogged, async (req, res) => {        

  try {
    let response = await CartController.getMyCart(req.user);  
    return res.status(200).send(response);
  } catch (error) {
    return res.status(404).send({status:'ERROR', result: error.message});
  }
})

module.exports = router;