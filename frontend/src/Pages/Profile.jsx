import { useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import PinkButton from "../Components/misc/PinkButton";
import { logoutUser } from "../Services/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Profile(){

    const {user, setUser} = useAuth();
    const navigate = useNavigate();

    // const getUser = async (user)=>{
    //     try{
    //         const res = await 
    //     }
    // }

    // useEffect(()=>{
        
    // },[])

    const handleLogout = async ()=>{
        try{
            const res = await logoutUser();
            toast.success(res.data.message);
        }
        catch(err){
            console.log(err);
            toast.error(res.response.data.message);
        }
        finally{
            setUser(null);
            navigate('/');
        }
    }

    return (
        <div className="h-[80vh] w-full">
            <form onSubmit={handleLogout}>
                <PinkButton content={"Log Out"}/>
            </form>
        </div>
    );
}