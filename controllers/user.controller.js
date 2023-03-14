const UserModel = require("../models/User.model");

class UserController {
  async getAll(req, res) {
    try {
      let usuarios = await UserModel.find().sort({ createdAt: -1 });
      return res.send({ status: "OK", usuarios });
    } catch (error) {
      return res.send({ status: "Error", msg: "Error petición getAll" });
    }
  }

  async getUserEmail(req, res) {
    try {
      const { email } = req.user;
      return res.send({ status: "OK", email });
    } catch (error) {
      return res.send({ status: "Error", msg: "Error petición getUserEmail" });
    }
  }

  async getById(req, res) {
    let { id } = req.params;
    try {
      let usuario = await UserModel.findById(id);
      return res.send({ status: "OK", usuario });
    } catch (error) {
      return res.send({ status: "ERROR", msg: "Error petición getById" });
    }
  }

  async getByName(req, res) {
    let { nombre } = req.params;
    try {
      let usuarios = await UserModel.find({
        nombre: { $regex: nombre, $options: "i" },
      });
      return res.send({ status: "OK", usuarios });
    } catch (error) {
      return res.send({ status: "ERROR", msg: "Error petición getByName" });
    }
  }

  async updateUser(req, res) {
    let { id } = req.params;
    try {
      let usuario = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!usuario)
        return res
          .status(400)
          .send({ status: "OK", msg: "Usuario no encontrado" });
      return res.send({ status: "OK", usuario });
    } catch (error) {
      return res.send({ status: "Error", msg: "Error petición updateUser" });
    }
  }

  async createUser(req, res) {
    try {
      let usuario = await UserModel.create(req.body);
      return res.send({ status: "OK", usuario });
    } catch (error) {
      return res.send({ status: "Error", msg: "Error petición createUser" });
    }
  }

  async deleteUser(req, res) {
    let { id } = req.params;
    try {
      let usuario = await UserModel.findByIdAndDelete(id);
      if (!usuario)
        return res
          .status(404)
          .send({
            status: "Error",
            result: `No se encuentra usuario con ID: ${id}`,
          });
      return res.status(200).send({ status: "OK", usuario });
    } catch (error) {
      return res.send({ status: "Error", msg: "Error petición deleteUser" });
    }
  }
}

module.exports = new UserController();
