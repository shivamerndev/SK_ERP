import Product from "../models/product.model.js";

const createProduct = async (productData) => {
    const product = await Product.create(productData);
    return product;
};

const getAllProducts = async () => {
    const products = await Product.find().lean();
    return products;
};

const getProductById = async (productId) => {
    const product = await Product.findById(productId).lean();
    return product;
};

const updateProduct = async (productId, productData) => {
    const product = await Product.findByIdAndUpdate(
        productId,
        { $set: productData },
        { new: true }
    ).lean();
    return product;
};

const deleteProduct = async (productId) => {
    const product = await Product.findByIdAndDelete(productId).lean();
    return product;
};

const searchProducts = async (query) => {
    const regex = new RegExp(query, "i");
    const products = await Product.find({
        $or: [
            { name: regex },
            { category: regex }
        ]
    }).lean();
    return products;
};

const searchCategories = async (query) => {
    const regex = new RegExp(query, "i");
    const categories = await Product.distinct("category", { category: regex });
    return categories;
};

export default {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts,
    searchCategories
};
