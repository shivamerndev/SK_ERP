import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../store/features/product.slice.js";
import {
    createProductService,
    getAllProductsService,
    updateProductService,
    deleteProductService
} from "./product.service.js";
import { toast } from "react-hot-toast";

const useProduct = () => {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.product.products);

    const handleAllProducts = async () => {
        try {
            const res = await getAllProductsService();
            dispatch(setProducts(res.data.data));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch products");
        }
    };

    const handleCreateProduct = async (productData) => {
        try {
            const res = await createProductService(productData);
            toast.success(res.data.message || "Product added successfully");
            await handleAllProducts();
            return res.data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create product");
            throw error;
        }
    };

    const handleUpdateProduct = async (productId, productData) => {
        try {
            const res = await updateProductService(productId, productData);
            toast.success(res.data.message || "Product updated successfully");
            await handleAllProducts();
            return res.data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update product");
            throw error;
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            const res = await deleteProductService(productId);
            toast.success(res.data.message || "Product deleted successfully");
            await handleAllProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete product");
            throw error;
        }
    };

    return {
        products,
        handleAllProducts,
        handleCreateProduct,
        handleUpdateProduct,
        handleDeleteProduct
    };
};

export default useProduct;
