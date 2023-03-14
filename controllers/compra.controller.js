const CompraModel = require("../models/Compra.model");
const CartModel = require("../models/Cart.model");
const { enviarMail } = require("../utils/enviarMail");

class CompraController {
  async getAll(req, res) {
    try {
      let compras = await CompraModel.find().populate("user").populate("cart");
      return res.status(200).send(compras);
    } catch (error) {
      return res.status(400).send({ status: "ERROR", result: error.message });
    }
  }

  async getCompraById(req, res) {
    let { id } = req.params;
    try {
      let compra = await CompraModel.findById(id)
        .populate("cart")
        .populate("user");
      return res.status(200).send(compra);
    } catch (error) {
      return res.status(400).send({ status: "ERROR", result: error.message });
    }
  }

  async getMyCompras(userId) {
    try {
      let result = await CompraModel.find({ user: userId }).populate("cart");
      return { status: "OK", result };
    } catch (error) {
      return { status: "ERROR", result: error.message };
    }
  }

  async newCompra(req, res) {
    let { cartId } = req.body;
    try {
      let compra = new CompraModel({ user: req.user._id, cart: cartId });
      await compra.save();
      await CartModel.findByIdAndUpdate(cartId, { activo: false });
      let newCompra = await CompraModel.findById(compra._id).populate(
        "user cart"
      );
      if (newCompra) {
        await CartModel.findByIdAndUpdate(cartId, { activo: false });
        let productosCompra = newCompra.cart.productos;
        let totalCompra = newCompra.cart.subTotal;
        let lista = "";
        for (let i = 0; i < productosCompra.length; i++) {
          const prod = productosCompra[i];
          lista += `
            <div>
              <p>Producto: ${prod.nombre}</p>
              <p>Cantidad: ${prod.quantity}</p>
              <p>SubTotal: ${prod.quantity * prod.price}</p>
            </div>
            <hr style="height:2px;border-width:0;color:gray;background-color:gray">
          `;
        }
        let mensaje = `<div>
          <h2>Detalle de su compra</h2>
          <hr style="height:2px;border-width:0;color:gray;background-color:gray">
          <div>
            ${lista}
          </div>
          <div>
            <h4>Monto Total ($): ${totalCompra}</h4>
          </div>
          <hr style="height:2px;border-width:0;color:gray;background-color:gray">
        </div>`;
        enviarMail(req.user.email, "Detalle de Compra", mensaje);
      }
      return res.status(200).send({ status: "OK", result: newCompra });
    } catch (error) {
      res.status(404).send({ status: "ERROR", result: error.message });
    }
  }

  async getEntreFechas(req, res) {
    let { desde, hasta } = req.query;
    try {
      let compras = await CompraModel.find({
        createdAt: {
          $gte: `${desde}T00:00:00.000Z`,
          $lte: `${hasta}T23:59:59.999Z`,
        },
      })
        .populate("user")
        .populate("cart");
      res.status(200).send({ status: "OK", compras });
    } catch (error) {
      res.status(404).send({ status: "ERROR", result: error.message });
    }
  }
}

module.exports = new CompraController();
