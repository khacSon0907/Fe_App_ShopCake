import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home"
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import Menu from "../pages/Menu/Menu";
import OtpResgister from "../pages/Register/OtpResgister";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<OtpResgister/>}/>
          <Route path="/login" element={<Login/>} />
          <Route path="/menu" element={<Menu/>} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
