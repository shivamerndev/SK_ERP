import { asyncHandler } from "../utils/asyncHanlder.utils.js";
import productValidator from "../validator/product.validator.js";
import productService from "../services/product.service.js";
import { AppError } from "../utils/error.utils.js";

const createProduct = asyncHandler(async (req, res) => {
    const { error, value } = productValidator(req.body);
    if (error) throw new AppError(400, error.details[0].message, error);

    const response = await productService.createProduct(value);
    return res.success(201, "Product Added Successfully 😊", response);
});

const getAllProducts = asyncHandler(async (req, res) => {
    const response = await productService.getAllProducts();
    return res.success(200, "Products Fetched Successfully", response);
});

const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const response = await productService.getProductById(id);
    return res.success(200, "Product Fetched Successfully", response);
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { error, value } = productValidator(req.body);
    if (error) throw new AppError(400, error.details[0].message, error);

    const response = await productService.updateProduct(id, value);
    return res.success(200, "Product Updated Successfully 😊", response);
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const response = await productService.deleteProduct(id);
    return res.success(200, "Product Deleted Successfully", response);
});

export {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
