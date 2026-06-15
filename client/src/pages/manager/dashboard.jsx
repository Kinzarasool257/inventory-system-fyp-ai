import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Store1Dashboard from "./Store1Dashboard";
import Store2Dashboard from "./Store2Dashboard";
import Store3Dashboard from "./Store3Dashboard";
import Store4Dashboard from "./Store4Dashboard";
import AdminDashboard from "../admin/admindashboard";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [message, setMessage] = useState("");

  // 🌐 Dynamic base URL fallback matching your production environment configurations
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://inventory-system-fyp-ai-production.up.railway.app';

  useEffect(() => {
    if (!user) return;

    const routeMap = {
      admin: "/admin-dashboard",
      store1: "/store1-dashboard",
      store2: "/store2-dashboard",
      store3: "/store3-dashboard",
      store4: "/store4-dashboard"
    };

    const fetchDashboard = async () => {
      try {
        // 🛠️ Swapped hardcoded path for the dynamic template string literal path
        const res = await fetch(`${baseUrl}${routeMap[user.role]}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (res.status === 403) {
          setMessage("Access Denied");
          return;
        }

        const data = await res.json();
        setMessage(data.message);
      } catch (err) {
        console.error(err);
        setMessage("Error fetching dashboard");
      }
    };

    fetchDashboard();
  }, [user, baseUrl]);

  if (!user) return <p>Please login first</p>;

  return (
    <div>
      {/* <button onClick={logout}>Logout</button> */}

      {/* Role-based dashboard */}
      {user.role === "admin" && <AdminDashboard />}
      {user.role === "store1" && <Store1Dashboard />}
      {user.role === "store2" && <Store2Dashboard />}
      {user.role === "store3" && <Store3Dashboard />}
      {user.role === "store4" && <Store4Dashboard />}
    </div>
  );
}