import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout(){
    return (
        <div className="h-screen w-full bg-white flex">
            <AdminSidebar/>

            <main className=" h-screen flex-1 flex-col">
                <Outlet/>
            </main>


        </div>
    );
}