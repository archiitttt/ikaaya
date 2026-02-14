import api from "../api/axios";

export const getAllProducts = ()=>{
    return api.get('/api/products');
}

export const getProductDetails = (id)=>{
    return api.get(`/api/products/${id}`);
}

export const getProductsByCategory = (category)=>{
    return api.get(`/api/products/category/${category}`);
}