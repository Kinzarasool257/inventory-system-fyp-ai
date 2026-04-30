import React, { useState } from 'react';
import { ChevronDown, Store, LayoutDashboard, ShieldCheck, MessageSquare } from 'lucide-react';

const Sidebar = ({ onStoreChange, selectedStore }) => {
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const stores = [
    { id: 'WH-1', label: 'Warehouse 01' },
    { id: 'WH-2', label: 'Warehouse 02' },
    { id: 'WH-3', label: 'Warehouse 03' },
    { id: 'WH-4', label: 'Warehouse 04' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 h-screen flex flex-col p-6">
      <div className="flex items-center gap-3 mb-10">
         <div className="p-2 bg-indigo-600 rounded-lg text-white font-bold">AD</div>
         <h1 className="text-xl font-bold italic uppercase tracking-tighter">Admin<span className="text-indigo-600">Hub</span></h1>
      </div>

      <nav className="space-y-2 flex-1">
        {/* Dashboard Link */}
        <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-100 cursor-pointer">
           <LayoutDashboard size={20}/> <span className="text-sm font-bold uppercase tracking-widest">General View</span>
        </div>

        {/* Store Selector Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsStoreOpen(!isStoreOpen)}
            className="w-full flex items-center justify-between gap-4 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-all font-bold uppercase text-[11px] tracking-widest"
          >
            <div className="flex items-center gap-4">
               <Store size={20}/> <span>Manage Stores</span>
            </div>
            <ChevronDown size={16} className={`transition-transform ${isStoreOpen ? 'rotate-180' : ''}`} />
          </button>

          {isStoreOpen && (
            <div className="mt-2 ml-6 space-y-1 border-l-2 border-slate-100 pl-4 animate-in fade-in slide-in-from-top-2">
              {stores.map((store) => (
                <button
                  key={store.id}
                  onClick={() => onStoreChange(store.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors ${selectedStore === store.id ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  {store.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;