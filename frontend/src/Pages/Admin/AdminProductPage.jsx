import { useEffect, useState } from "react";
import { getAllProducts } from "../../Services/productService";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'

export default function AdminProductPage(){

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        const getProducts = async ()=>{
            try{
                setLoading(true);
                const res = await getAllProducts();
                setProducts(res?.data.data);
            }
            catch(err){
                console.log(err);
            }
            finally{
                setLoading(false);
            }
        }

        getProducts();
    },[])

    return (
        <div className="h-screen flex-1 white flex flex-col p-4">

            {loading && (<h1>Loading...</h1>)}

            {!loading && products.length===0 && (
                <h1>No products to show :(</h1>
            )}

            {!loading && products.length>0 && (
                <div className="overflow-x-auto rounded-lg shadow-md bg-white">
                    <table className="min-w-full border-collapse">
                        <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold">S.No</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Stock</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                        </tr>
                        </thead>

                        <tbody>
                        {products.map((item, idx) => (
                            <tr onClick={()=>{navigate(`/admin/products/${item._id}`)}}
                            key={item._id}
                            className="border-b last:border-none hover:bg-gray-100 transition"
                            >
                            <td className="px-4 py-3 text-sm text-gray-700">{idx + 1}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {item.name}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                                {item.category}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                                ₹{item.price}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                                {item.stock}
                            </td>
                            <td className="px-4 py-3 text-sm">
                                <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold
                                    ${
                                    item.isActive
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                                >
                                {item.isActive ? "Active" : "Inactive"}
                                </span>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
}