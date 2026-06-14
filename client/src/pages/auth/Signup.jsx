import React, { useState } from 'react';
import inventoryBg from "../../assets/inventory_illustration.jpeg";
import { ArrowLeft } from "lucide-react";
import smartStockLogo from "../../assets/Smart Stock (4).png";
import googleIcon from '../../assets/google.png';
import appleIcon from '../../assets/apple.png';
import { useNavigate, Link } from 'react-router-dom';
import Axios from 'axios';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const createUser = () => {
    Axios.post('http://localhost:3002/signup', {
      Email: email,
      Name: name,
      Password: password,
      role: 'store1'
    })
      .then(() => {
        setSuccessMessage('Account created successfully! Redirecting...');
        setEmail('');
        setName('');
        setPassword('');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      })
      .catch((err) => {
        console.error(err);
        setSuccessMessage(`Signup failed. Please try again.`);
      });
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen bg-[#e2eff5]">
      <div className="w-full md:w-1/2 flex justify-center items-center bg-white/80 backdrop-blur-md px-6 py-8 relative z-10">
        <div className="w-full max-w-sm">
          <div className="relative mb-8 flex items-center justify-center">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-0 text-slate-400 hover:text-[#4b7291]"
            >
              <ArrowLeft size={26} />
            </button>
            {/* Logo Image added in place of text */}
            <img src={smartStockLogo} alt="Smart Stock Manager" className="h-40 w-auto" />
          </div>

          <h2 className="text-3xl font-black mb-2 text-slate-800 italic tracking-tighter uppercase">Join Network</h2>
          <p className="text-sm font-bold text-slate-500 mb-6 uppercase tracking-widest">
            Create your terminal credentials
          </p>

          {successMessage && (
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-black px-4 py-3 rounded-xl mb-4 text-xs uppercase tracking-widest text-center shadow-sm">
              {successMessage}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1">Full Name</label>
              <input
                type="text"
                placeholder="Operator Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#4b7291] shadow-inner"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1">Email address</label>
              <input
                type="email"
                placeholder="name@smartstock.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#4b7291] shadow-inner"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#4b7291] shadow-inner"
              />
            </div>

            <button
              className="bg-[#4b7291] text-white w-full py-4 rounded-2xl hover:bg-[#3a5a70] shadow-[0_10px_20px_rgba(75,114,145,0.3)] transition-all font-black uppercase text-xs tracking-[0.2em] active:scale-95 mt-4"
              onClick={createUser}
            >
              Sign Up 
            </button>
          </div>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-slate-200" />
            <span className="px-4 text-slate-400 font-black text-[10px] uppercase">OR</span>
            <hr className="flex-grow border-slate-200" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6 font-black uppercase text-[9px] tracking-widest">
            <button className="w-full py-3 rounded-xl border border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-50">
              <img src={googleIcon} alt="Google" className="w-4 h-4" />
              Google
            </button>
            <button className="w-full py-3 rounded-xl border border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-50">
              <img src={appleIcon} alt="Apple" className="w-4 h-4" />
              Apple
            </button>
          </div>

          <p className="text-[11px] font-bold text-center text-slate-500 uppercase tracking-wider">
            Have an account?{' '}
            <Link to="/login" className="text-[#4b7291] font-black hover:underline">
              Terminal Login
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

export default Signup;