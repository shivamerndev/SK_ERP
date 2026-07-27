import { api } from "../utils/axios.utils.js";

const createProductService = (productData) => api.post("/product/", productData);
const getAllProductsService = () => api.get("/product/");
const updateProductService = (productId, productData) => api.put(`/product/${productId}`, productData);
const deleteProductService = (productId) => api.delete(`/product/${productId}`);

export {
    createProductService,
    getAllProductsService,
    updateProductService,
    deleteProductService
};
