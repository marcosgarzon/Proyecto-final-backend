const ProductModel = require("../models/Product.model");
const { logger_info } = require("../logs/files/log_config");

class ProductController {
  getAll = async () => {
    try {
      const result = await ProductModel.find().sort({ createdAt: -1 });
      return { status: "OK", result };
    } catch (error) {
      logger_info.error(error);
      return { status: "Error", result: error.message };
    }
  };

  searchName = async (cadena) => {
    try {
      const result =
        cadena.length > 0
          ? await ProductModel.find({ nombre: new RegExp(cadena, "i") })
          : await ProductModel.find();
      return { status: "OK", result };
    } catch (error) {
      logger_info.error(error);
      return { status: "Error", result: error.message };
    }
  };

  getByCategoria = async (categoria) => {
    try {
      const result = await ProductModel.find({ categoria }).sort({
        createdAt: -1,
      });
      return { status: "OK", result };
    } catch (error) {
      logger_info.error(error);
      return { status: "Error", result: error.message };
    }
  };

  getById = async (id) => {
    try {
      const result = await ProductModel.findById(id);
      if (!result) {
        return {
          status: "Error",
          result: `No se encuentra producto con ID: ${id}`,
        };
      }
      return { status: "OK", result };
    } catch (error) {
      logger_info.error(error);
      return { status: "Error", result: error.message };
    }
  };

  createProduct = async (prod) => {
    try {
      const result = await ProductModel.create(prod);
      return { status: "OK", result };
    } catch (error) {
      logger_info.error(error);
      return { status: "Error", result: error.message };
    }
  };

  editProduct = async (id_prod, prod) => {
    try {
      const result = await ProductModel.findByIdAndUpdate(id_prod, prod, {
        new: true,
      });
      if (!result) {
        return {
          status: "Error",
          result: `No se encuentra producto con ID: ${id}`,
        };
      }
      return { status: "OK", result };
    } catch (error) {
      logger_info.error(error);
      return { status: "Error", result: error.message };
    }
  };

  deleteProduct = async (id_prod) => {
    try {
      const result = await ProductModel.findByIdAndDelete(id_prod);
      if (!result) {
        return {
          status: "Error",
          result: `No se encuentra producto con ID: ${id}`,
        };
      }
      return { status: "OK", result };
    } catch (error) {
      logger_info.error(error);
      return { status: "Error", result: error.message };
    }
  };
}

module.exports = new ProductController();
