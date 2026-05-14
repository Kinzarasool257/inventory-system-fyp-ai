import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import inventoryBg from '../assets/inventory_illustration.jpeg'; 
import { ArrowLeft } from 'lucide-react';
// Import the new logo image
import smartStockLogo from '../assets/Smart Stock (4).png'; 
import googleIcon from '../assets/google.png';
import appleIcon from '../assets/apple.png';
import Axios from 'axios';
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth(); 
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post('http://localhost:3002/login', {
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

  useEffect(() => {
    if (loginError) {
      const timer = setTimeout(() => setLoginError(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [loginError]);

  return (
    <div className="flex flex-col md:flex-row w-full h-screen bg-[#e2eff5]">
      {/* Left Section - Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-white/80 backdrop-blur-md px-6 py-8 relative z-10">
        <div className="w-full max-w-sm">
          <div className="relative mb-8 flex items-center justify-center">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-0 text-slate-400 hover:text-[#4b7291] transition-colors"
            >
              <ArrowLeft size={26} />
            </button>
            {/* Logo Image added in place of text */}
            <img src={smartStockLogo} alt="Smart Stock Manager" className="h-40 w-auto" />
          </div>

          <h2 className="text-3xl font-black mb-2 text-slate-800 italic tracking-tighter uppercase">Welcome back!</h2>
          <p className="text-sm font-bold text-slate-500 mb-6 uppercase tracking-widest">
            Access your inventory terminal
          </p>

          {loginError && (
            <div className="bg-rose-500 text-white px-4 py-3 rounded-xl mb-4 font-black text-xs uppercase tracking-widest text-center shadow-lg">
              {loginError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">
                Email address
              </label>
              <input
                type="email"
                value={loginEmail}
                placeholder="admin@smartstock.com"
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#4b7291] transition-all shadow-inner"
              />
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] ml-1">Password</label>
                <a href="#" className="text-[10px] text-[#4b7291] font-black uppercase tracking-widest hover:underline">Forgot?</a>
              </div>
              <input
                type="password"
                value={loginPassword}
                placeholder="••••••••"
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#4b7291] transition-all shadow-inner"
              />
            </div>

            <div className="flex items-center text-[11px] mb-6">
              <label className="font-bold text-slate-600 flex items-center cursor-pointer">
                <input type="checkbox" className="mr-2 accent-[#4b7291] h-4 w-4" /> 
                <span className="uppercase tracking-wider">Keep me logged in</span>
              </label>
            </div>

            <button
              className="bg-[#4b7291] text-white w-full py-4 rounded-2xl hover:bg-[#3a5a70] shadow-[0_10px_20px_rgba(75,114,145,0.3)] transition-all font-black uppercase text-xs tracking-[0.2em] active:scale-95"
              onClick={loginUser}
            >
              Login 
            </button>
          </div>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-slate-200" />
            <span className="px-4 text-slate-400 font-black text-[10px] uppercase">OR</span>
            <hr className="flex-grow border-slate-200" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6 font-black uppercase text-[9px] tracking-widest">
            <button className="w-full py-3 rounded-xl border border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
              <img src={googleIcon} alt="Google" className="w-4 h-4" />
              Google
            </button>
            <button className="w-full py-3 rounded-xl border border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
              <img src={appleIcon} alt="Apple" className="w-4 h-4" />
              Apple
            </button>
          </div>

          <p className="text-[11px] font-bold text-center text-slate-500 uppercase tracking-wider">
            No access?{' '}
            <Link to="/signup" className="text-[#4b7291] font-black hover:underline">
              Request Signup
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section - Image maximized */}
      <div className="hidden md:flex w-1/2 h-full bg-[#f8fafc]">
        <img
          src={inventoryBg}
          alt="Inventory Illustration"
          className="w-full h-full object-cover rounded-xl shadow-inner"
        />
      </div>
    </div>
  );
};

export default Login;