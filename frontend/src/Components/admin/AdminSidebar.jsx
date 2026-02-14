import { useState } from "react";
import { Link } from "react-router-dom";

export default function AdminSidebar(){

    const [open, setOpen] = useState(true);

    const Links = [
        {name : 'Dashboard', to : 'admin'},
        {name : 'Products', to : 'admin/products'}, 
        {name : 'Settings', to : 'admin/settings'}
    ];

    return (
        <div className={`${open? 'w-56' : 'w-16'} h-screen bg-white transition-all duration-200 ease-in-out flex flex-col justify-between shadow-2xl shadow-gray-400`}>
            <div>
                <div className="p-3 flex justify-evenly items-center text-black font-bold text-xl">
                    {open && (<h2>Ikaaya - Admin</h2>)}
                    <button onClick={()=>{setOpen(!open)}}>☰</button>
                </div>
                {open && (<div className="flex flex-col">
                    <hr className=" border-gray-800 w-3/4 self-center mt-2 mb-2"/>
                    <div className="p-4 text-black text-xl flex flex-col justify-evenly gap-10">
                        {Links?.map(item => (
                            <Link to={item.to}>{item.name}</Link>
                        ))}
                    </div>
                </div>)}
            </div>
            <div>
                {open && (<div className="flex flex-col">
                    <hr className=" border-gray-800 w-3/4 self-center mt-2 mb-2"/>
                    <p className="p-4 text-black text-xl">Logout</p>
                </div>)}
            </div>
        </div>
    );
}
