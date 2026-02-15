import api from "../../api/axios";

export const updateProduct = (id, formData)=>{
    return api.put(`/admin/products/${id}`, formData, {
        headers: {
        "Content-Type": "multipart/form-data"
        }
    });
}

export const deleteProduct = (id)=>{
    return api.delete(`/admin/products/${id}`);
}

export const createProduct = (formData)=>{
    return api.post(`/admin/products`, formData, {
        headers: {
        "Content-Type": "multipart/form-data"
        }
    })
}

export const getTotalProductsNumber = ()=>{
    return api.get('/admin/products/number');
}