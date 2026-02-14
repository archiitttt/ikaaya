import { useState } from "react";
import PinkButton from "../Components/misc/PinkButton";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../Services/authService.js";
import { useAuth } from "../Context/AuthContext.jsx";

export default function Signup() {
  const navigate = useNavigate();

  const {checkAuth} = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await signupUser(formData);
      await checkAuth();
      toast.success(res.data.message);
      navigate("/");
    } catch (err) {
      toast.error(err.response.data.message);
    } finally{
        setLoading(false);
    }

    setFormData({
      name: "",
      phone: "",
      email: "",
      password: "",
    });
  }

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center px-4 sm:px-0">
      <div className="w-full max-w-md sm:max-w-lg bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/30 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-6 sm:p-10 flex flex-col gap-8">
        
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-heading text-pink-600 font-bold">
            Create Account
          </h1>
          <p className="mt-3 text-gray-500 text-sm sm:text-base">
            Join ikaaya to explore the world of beaded jewelry made with love
          </p>
        </div>

        <hr className="h-px bg-black/20 w-full" />

        {/* Form */}
        <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="p-3 sm:p-4 px-5 sm:px-6 rounded-full text-sm sm:text-base focus:outline-none"
            value={formData.name}
            onChange={handleChange}
            required
            minLength={1}
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            className="p-3 sm:p-4 px-5 sm:px-6 rounded-full text-sm sm:text-base focus:outline-none"
            value={formData.phone}
            onChange={handleChange}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="p-3 sm:p-4 px-5 sm:px-6 rounded-full text-sm sm:text-base focus:outline-none"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="p-3 sm:p-4 px-5 sm:px-6 rounded-full text-sm sm:text-base focus:outline-none"
            value={formData.password}
            onChange={handleChange}
            required minLength={6}
          />

          <PinkButton content={loading ? "Signing up..." : "Signup"} disabled={loading} />
        </form>

        {/* Footer text */}
        <p className="text-center text-gray-500 text-xs sm:text-sm">
          By signing in, you agree to our TERMS and CONDITIONS.
        </p>
      </div>
    </div>
  );
}
