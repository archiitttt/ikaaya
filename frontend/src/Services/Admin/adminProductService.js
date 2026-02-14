import api from "../../api/axios";

export const updateProduct = (id, formData)=>{
    return api.put(`/admin/products/${id}`, formData, {
        headers: {
        "Content-Type": "multipart/form-data"
        }
    });
}