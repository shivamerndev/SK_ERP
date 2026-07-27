import productRepo from "../repository/product.dao.js";
import { AppError } from "../utils/error.utils.js";

const createProduct = async (productData) => {
    const product = await productRepo.createProduct(productData);
    return product;
};

const getAllProducts = async () => {
    const products = await productRepo.getAllProducts();
    return products;
};

const getProductById = async (productId) => {
    const product = await productRepo.getProductById(productId);
    if (!product) throw new AppError(404, "Product not found");
    return product;
};

const updateProduct = async (productId, productData) => {
    const product = await productRepo.updateProduct(productId, productData);
    if (!product) throw new AppError(404, "Product not found");
    return product;
};

const deleteProduct = async (productId) => {
    const product = await productRepo.deleteProduct(productId);
    if (!product) throw new AppError(404, "Product not found");
    return product;
};

export default {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
