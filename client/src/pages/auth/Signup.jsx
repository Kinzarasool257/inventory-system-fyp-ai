import React, { useState } from 'react';
import inventoryBg from "../../assets/inventory_illustration.jpeg";
import { ArrowLeft } from "lucide-react";
import smartStockLogo from "../../assets/Smart Stock (4).png";
import { useNavigate, Link } from 'react-router-dom';
import Axios from 'axios';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const validateForm = () => {
    if (!name.trim()) return "Name is required";
    if (!email.trim()) return "Email is required";
    if (!email.includes("@")) return "Enter a valid email";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const createUser = () => {
    const error = validateForm();

    if (error) {
      setErrorMessage(error);
      setSuccessMessage('');
      return;
    }

    Axios.post('http://localhost:3002/signup', {
      Email: email,
      Name: name,
      Password: password,
      role: 'store1'
    })
      .then(() => {
        setSuccessMessage('Account created successfully! Redirecting...');
        setErrorMessage('');
        setEmail('');
        setName('');
        setPassword('');

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage('Signup failed. Email may already exist.');
        setSuccessMessage('');
      });
  };

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
            Join Network
          </h2>

          <p className="text-sm font-bold text-slate-500 mb-6 uppercase tracking-widest">
            Create your terminal credentials
          </p>

          {/* ERROR MESSAGE */}
          {errorMessage && (
            <div className="bg-rose-50 text-rose-600 border border-rose-100 font-black px-4 py-3 rounded-xl mb-4 text-xs uppercase text-center">
              {errorMessage}
            </div>
          )}

          {/* SUCCESS MESSAGE */}
          {successMessage && (
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-black px-4 py-3 rounded-xl mb-4 text-xs uppercase text-center">
              {successMessage}
            </div>
          )}

          {/* FORM */}
          <div className="space-y-4">

            {/* NAME */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Operator Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#4b7291]"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1">
                Email address
              </label>
              <input
                type="email"
                placeholder="name@smartstock.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#4b7291]"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#4b7291]"
              />
              <p className="text-[10px] text-slate-400 mt-1 ml-1">
                Minimum 6 characters required
              </p>
            </div>

            {/* BUTTON */}
            <button
              className="bg-[#4b7291] text-white w-full py-4 rounded-2xl hover:bg-[#3a5a70] font-black uppercase text-xs tracking-widest active:scale-95"
              onClick={createUser}
            >
              Sign Up
            </button>
          </div>

          {/* LOGIN LINK */}
          <p className="text-[11px] font-bold text-center text-slate-500 uppercase tracking-wider mt-6">
            Have an account?{" "}
            <Link to="/login" className="text-[#4b7291] font-black hover:underline">
              Terminal Login
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

export default Signup;