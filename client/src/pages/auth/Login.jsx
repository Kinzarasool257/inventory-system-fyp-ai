import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import inventoryBg from '../../assets/inventory_illustration.jpeg'; 
import { ArrowLeft } from 'lucide-react';
import smartStockLogo from '../../assets/Smart Stock (4).png'; 
import Axios from 'axios';
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login } = useAuth(); 
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    if (!loginEmail.trim()) return "Email is required";
    if (!loginEmail.includes("@")) return "Enter a valid email";
    if (!loginPassword) return "Password is required";
    if (loginPassword.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  // ---------------- LOGIN ----------------
  const loginUser = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      setLoginError(error);
      return;
    }

    try {
      const response = await Axios.post('https://inventory-system-fyp-ai-production.up.railway.app/login', {
        LoginEmail: loginEmail,
        LoginPassword: loginPassword,
      });

      const data = response.data;

      if (data.token && data.user) {
        login({
          name: data.user.name,
          role: data.user.role,
          token: data.token,
        });

        setLoginEmail('');
        setLoginPassword('');
        setLoginError('');
        navigate('/dashboard');
      } else {
        setLoginError(data.message || 'Invalid credentials');
      }
    } catch (error) {
      setLoginError('Something went wrong. Try again.');
      console.error(error);
    }
  };

  // auto clear error
  useEffect(() => {
    if (loginError) {
      const timer = setTimeout(() => setLoginError(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [loginError]);

  return (
    <div className="flex flex-col md:flex-row w-full h-screen bg-[#e2eff5]">

      {/* LEFT SIDE */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-white/80 backdrop-blur-md px-6 py-8 relative z-10">
        <div className="w-full max-w-sm">

          {/* HEADER */}
          <div className="relative mb-8 flex items-center justify-center">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-0 text-slate-400 hover:text-[#4b7291]"
            >
              <ArrowLeft size={26} />
            </button>

            <img
              src={smartStockLogo}
              alt="Smart Stock Manager"
              className="h-40 w-auto"
            />
          </div>

          <h2 className="text-3xl font-black mb-2 text-slate-800 italic tracking-tighter uppercase">
            Welcome back!
          </h2>

          <p className="text-sm font-bold text-slate-500 mb-6 uppercase tracking-widest">
            Access your inventory terminal
          </p>

          {/* ERROR */}
          {loginError && (
            <div className="bg-rose-500 text-white px-4 py-3 rounded-xl mb-4 font-black text-xs uppercase tracking-widest text-center shadow-lg">
              {loginError}
            </div>
          )}

          {/* FORM */}
          <div className="space-y-4">

            {/* EMAIL */}
            <div>
              <label className="block font-black text-[10px] text-slate-400 uppercase mb-2 ml-1">
                Email address
              </label>
              <input
                type="email"
                value={loginEmail}
                placeholder="admin@smartstock.com"
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#4b7291]"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block font-black text-[10px] text-slate-400 uppercase mb-2 ml-1">
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                placeholder="••••••••"
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#4b7291]"
              />
            </div>

            {/* LOGIN BUTTON */}
            <button
              className="bg-[#4b7291] text-white w-full py-4 rounded-2xl hover:bg-[#3a5a70] font-black uppercase text-xs tracking-widest active:scale-95"
              onClick={loginUser}
            >
              Login
            </button>
          </div>

          {/* DIVIDER */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-slate-200" />
            <span className="px-4 text-slate-400 font-black text-[10px] uppercase">
              OR
            </span>
            <hr className="flex-grow border-slate-200" />
          </div>

          {/* SIGNUP LINK */}
          <p className="text-[11px] font-bold text-center text-slate-500 uppercase tracking-wider">
            No access?{" "}
            <Link to="/signup" className="text-[#4b7291] font-black hover:underline">
              Request Signup
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="hidden md:flex w-1/2 h-full bg-[#f8fafc]">
        <img
          src={inventoryBg}
          alt="Inventory Illustration"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;