import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import { Products, Orders, Reports, Inventory, Settings } from "./pages/PlaceholderPages";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/dashboard"  element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/customers"  element={<PrivateRoute><Customers /></PrivateRoute>} />
        <Route path="/products"   element={<PrivateRoute><Products /></PrivateRoute>} />
        <Route path="/orders"     element={<PrivateRoute><Orders /></PrivateRoute>} />
        <Route path="/reports"    element={<PrivateRoute><Reports /></PrivateRoute>} />
        <Route path="/inventory"  element={<PrivateRoute><Inventory /></PrivateRoute>} />
        <Route path="/settings"   element={<PrivateRoute><Settings /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;