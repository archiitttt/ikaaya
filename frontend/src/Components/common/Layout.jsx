import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function Layout() {

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#FFF2EB] flex flex-col">
      <Navbar />

      <main className="flex flex-col w-full flex-1">
        <Outlet/>
      </main>

      <Footer />
    </div>
  );
}
