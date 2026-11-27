import { BrowserRouter, Link } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import Plans from "./components/Plans";


export default function App() {
  return (
    <div>
      <Navbar />
      <Plans />
    </div>
  );
}