import { asyncHandler } from "../utils/asyncHanlder.utils.js"
import customerService from "../services/customer.service.js"
import productService from "../services/product.service.js"

export const getSearch = asyncHandler(async (req, res) => {
    const query = req.query.q || req.query.query

    if (!query || !query.trim()) {
        return res.success(200, "Search results", [])
    }

    const trimmedQuery = query.trim();

    const [customerResults, productResults, categoryResults] = await Promise.all([
        customerService.searchCustomers(trimmedQuery),
        productService.searchProducts(trimmedQuery),
        productService.searchCategories(trimmedQuery)
    ]);

    const formattedCustomers = customerResults.map(customer => ({
        _id: customer._id,
        type: "customer",
        fullName: customer.fullName,
        shopName: customer.shopName,
        address: customer.address,
        phone: customer.phone,
        title: customer.fullName,
        url: `/customers?id=${customer._id}`
    }));

    const formattedProducts = productResults.map(product => ({
        _id: product._id,
        type: "product",
        name: product.name,
        category: product.category,
        pieces: product.pieces,
        image: product.image,
        title: product.name,
        url: `/inventory?id=${product._id}`
    }));

    const formattedCategories = categoryResults.map(category => ({
        _id: `category-${category}`,
        type: "category",
        name: category,
        title: category,
        url: `/inventory?category=${encodeURIComponent(category)}`
    }));

    const formattedResults = [...formattedCustomers, ...formattedProducts, ...formattedCategories];

    return res.success(200, "Search results", formattedResults)
})