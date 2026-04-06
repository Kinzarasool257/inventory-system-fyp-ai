import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./Store1Dashboard";
import ManagerDashboard from "./Store2Dashboard";
import UserDashboard from "./Store3Dashboard";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;

    const routeMap = {
      store1: "/store1-dashboard",
      store2: "/store2-dashboard",
      store3: "/store3-dashboard",
    };

    const fetchDashboard = async () => {
      try {
        const res = await fetch(`http://localhost:3002${routeMap[user.role]}`, {
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
  }, [user]);

  if (!user) return <p>Please login first</p>;

  return (
    <div>
      {/* <button onClick={logout}>Logout</button> */}

      {/* Role-based dashboard */}
      {user.role === "store1" && <AdminDashboard />}
      {user.role === "store2" && <ManagerDashboard />}
      {user.role === "store3" && <UserDashboard />}
    </div>
  );
}