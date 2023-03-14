const mongoose = require("mongoose");
const CartModel = require("../models/Cart.model");
const ProductController = require("./product.controller");

class CartController {
  async getMyCart(user) {
    try {
      let result = await CartModel.findOne({ userId: user._id, activo: true });
      if (!result)
        return {
          status: "OK",
          carrito: { productos: [] },
          cantidad: 0,
          total: 0,
        };
      let productos = result.productos;
      let cantidad = 0;
      for (let i = 0; i < productos.length; i++) {
        cantidad += productos[i].quantity;
      }
      return {
        status: "OK",
        carrito: result,
        cantidad,
        total: result.subTotal,
      };
    } catch (error) {
      return { status: "ERROR", result: error.message };
    }
  }

  async getById(id_cart) {
    try {
      let result = await CartModel.findById(id_cart);
      if (!result)
        return { status: "ERROR", result: `No existe carrito ID: ${id_cart}` };
      return { status: "OK", result };
    } catch (error) {
      return { status: "ERROR", result: error.message };
    }
  }

  async createCart(prod, userId) {
    try {
      let prod_id = prod.product_id.trim();
      let cart = await CartModel.findOne({ userId, activo: true });
      if (cart) return await this.addProductToCart(cart._id, prod);
      let subTotal = prod.quantity * prod.price;
      let newCart = await CartModel.create({
        userId,
        productos: prod,
        subTotal,
      });
      let response = await ProductController.getById(prod_id);
      let prod_stock = response.result.stock;
      prod_stock -= 1;
      let prod_updated = await ProductController.editProduct(prod_id, {
        stock: prod_stock,
      });
      return { status: "OK", prod_id, prod_updated };
    } catch (error) {
      return { status: "ERROR", result: error.message };
    }
  }

  async delete(id_cart) {
    try {
      let result = await CartModel.findByIdAndDelete(id_cart);
      return { status: "OK", result: `Carrito ID: ${id_cart} eliminado` };
    } catch (error) {
      return { status: "ERROR", result: error.message };
    }
  }

  async addProductToCart(id_cart, producto) {
    try {
      let prod_id = producto.product_id.trim();
      let cart = await CartModel.findById(id_cart);
      if (!cart)
        return { status: "ERROR", result: `No existe carrito ID: ${id_cart}` };
      let productos = cart.productos;
      let prod_buscado = productos.find((p) => p.product_id === prod_id);
      if (prod_buscado) {
        prod_buscado.quantity += producto.quantity;
        cart.subTotal += producto.quantity * producto.price;
      } else {
        // Si no existe lo creo
        cart.productos.push(producto);
        cart.subTotal += producto.quantity * producto.price;
      }
      let resp = await CartModel.findByIdAndUpdate(
        { _id: id_cart },
        { subTotal: cart.subTotal, productos }
      );
      let response = await ProductController.getById(prod_id);
      let prod_stock = response.result.stock;
      prod_stock -= 1;
      let prod_updated = await ProductController.editProduct(prod_id, {
        stock: prod_stock,
      });
      return { status: "OK", result: resp, prod_updated };
    } catch (error) {
      return { status: "ERROR", result: error.message };
    }
  }

  async deleteProductFromCart(id_cart, id_prod) {
    try {
      let carrito = await CartModel.findById(id_cart);
      if (!carrito)
        return { status: "ERROR", result: `No existe carrito ID: ${id_cart}` };
      let productos_carrito = carrito.productos; // Array con los productos del carrito
      let prod_buscado = productos_carrito.find(
        (p) => p.product_id === id_prod
      );
      if (!prod_buscado)
        return {
          status: "ERROR",
          result: `No existe producto ID: ${id_prod} en el carrito`,
        };
      let subTotal =
        carrito.subTotal - prod_buscado.quantity * prod_buscado.price;
      productos_carrito = productos_carrito.filter(
        (p) => p.product_id !== id_prod
      );
      if (productos_carrito.length === 0) {
        let result = await CartModel.findByIdAndDelete(id_cart);
        return { status: "OK", result: "Carrito borrado" };
      } else {
        let result = await CartModel.findByIdAndUpdate(
          id_cart,
          { productos: productos_carrito, subTotal },
          { new: true }
        );
        return { status: "OK", result };
      }
    } catch (error) {
      return { status: "ERROR", result: error.message };
    }
  }
}

module.exports = new CartController();
