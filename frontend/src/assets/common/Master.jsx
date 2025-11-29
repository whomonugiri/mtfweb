import { Outlet } from "react-router";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export const Master = () => {
  return (
    <div>
      <Header />
      <Sidebar />
      <div className="container">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};
