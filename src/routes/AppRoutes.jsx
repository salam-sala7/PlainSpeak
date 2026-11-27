import { Routes, Route } from "react-router-dom";
import Plans from "../components/Plans";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      <Route path="/" element={<h1>Home Page</h1>} />
      <Route path="/pricing" element={<Plans />} />
      
    </Routes>
  );
}