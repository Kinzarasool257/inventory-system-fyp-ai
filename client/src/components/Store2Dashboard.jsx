import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TrendingUp, BarChart3, ShieldCheck, BrainCircuit, Activity,
  Truck, AlertCircle, Eye, Gauge, ArrowRight, Search, 
  FileText, DollarSign, Package, AlertTriangle, LayoutDashboard,
  Settings, Database, Bell, User, Menu, X, Download, ShieldAlert,
  Layers, ShoppingCart
} from 'lucide-react';

const Store2Dashboard = () => {
  // 1. DYNAMIC AUTH & ROLE MANAGEMENT
  // Retrieve user data from your AuthContext or LocalStorage after login
  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem('user'); 
    return savedUser ? JSON.parse(savedUser) : { role: 'store1', name: 'Authorized User' };
  });

  // Automatically map the role (store1, store2, etc.) to the Warehouse ID
  // const roleToWH = {
  //   'store1': 'WH-1',
  //   'store2': 'WH-2',
  //   'store3': 'WH-3',
  //   'store4': 'WH-4',
  //   'admin': 'WH-1' // Admin defaults to WH-1 or can be handled separately
  // };

  const selectedStore =  'WH-2';
  
  // 2. STATE MANAGEMENT
  const [selectedProduct, setSelectedProduct] = useState('Book_1');
  const [selectedCategory, setSelectedCategory] = useState('Books');
  const [currentStock, setCurrentStock] = useState(50);
  const [basePrice, setBasePrice] = useState(100.00);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  // API Data States
  const [inventoryLog, setInventoryLog] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [auditSummary, setAuditSummary] = useState({
    financial_loss: 0, dead_stock: 0, market_gaps: 0, revenue_gaps: 0
  });
  const [anomalies, setAnomalies] = useState([]);
  const [forecastResult, setForecastResult] = useState(null);
  const [auditReport, setAuditReport] = useState(null);

  const [isAnomalyModalOpen, setIsAnomalyModalOpen] = useState(false);
  const categories = ['Books', 'Toys', 'Electronics', 'Clothes'];

  // 3. API INTEGRATION
  const fetchInventory = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/StockData/inventory?store=${selectedStore}&item=${selectedProduct}`);
      const data = response.data || [];
      setInventoryLog(data);
      const total = data.reduce((sum, row) => sum + (parseFloat(row.revenue) || 0), 0);
      setTotalRevenue(total);
    } catch (error) {
      console.error("Inventory Fetch Error:", error);
    }
  };

  const fetchAuditSummary = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/api/audit-summary?warehouse=${selectedStore}&category=${selectedCategory}`);
      setAuditSummary(response.data || { financial_loss: 0, dead_stock: 0, market_gaps: 0, revenue_gaps: 0 });
    } catch (error) {
      console.error("Audit Summary Error:", error);
    }
  };

  const fetchAnomalies = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/api/anomalies`);
      // Filter anomalies to only show those belonging to the logged-in store
      const filtered = (response.data || []).filter(a => a.warehouse_id === selectedStore);
      setAnomalies(filtered);
    } catch (error) {
      console.error("Anomaly Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchAuditSummary();
    fetchAnomalies();
  }, [selectedStore, selectedProduct, selectedCategory]);

  const runAIForecast = async () => {
    setIsSyncing(true);
    try {
      const response = await axios.post(`http://localhost:3002/api/predict`, {
        store: selectedStore,
        item: selectedProduct,
        stock: currentStock,
        price: basePrice
      });
      setForecastResult(response.data);
    } catch (error) { console.error(error); }
    finally { setIsSyncing(false); }
  };

  return (
    <div className="flex min-h-screen bg-[#060608] text-slate-200">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a0c] border-r border-white/5 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="p-2 bg-blue-600 rounded-lg"><Database size={20} className="text-white" /></div>
          <h1 className="text-xl font-black tracking-tighter italic uppercase underline decoration-blue-500">Smart<span className="text-blue-500">Stock</span></h1>
        </div>
        <nav className="p-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={18}/>} label="My Warehouse" active />
          <NavItem icon={<BarChart3 size={18}/>} label="Sales Data" />
          <NavItem icon={<ShieldCheck size={18}/>} label="Forensic Audit" />
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* NAVBAR - Switching options removed as requested */}
        <nav className="h-16 bg-[#0a0a0c]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden text-slate-400"><Menu /></button>
            <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Authenticated: {userData.role}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 border-l border-white/10 pl-6">
              <div className="text-right">
                <p className="text-xs font-black uppercase tracking-tighter">{userData.name}</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase">{selectedStore} Operator</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-black text-xs text-white uppercase">{userData.role.substring(0,2)}</div>
          </div>
        </nav>

        <main className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3">
              <Gauge className="text-blue-500" /> {selectedStore} Terminal Console
            </h2>
          </header>

          {/* STATS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Warehouse Revenue" value={`$${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`} trend="Live Sync" icon={<DollarSign className="text-green-500"/>} />
            <StatCard label="Inventory Rows" value={inventoryLog.length} trend="Validated" icon={<Package className="text-blue-500"/>} />
            <StatCard label="Store Anomalies" value={anomalies.length} trend="Alert" icon={<AlertTriangle className="text-red-500"/>} onClick={() => setIsAnomalyModalOpen(true)} clickable />
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between">
                <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Role Access</div>
                <p className="text-xl font-black text-blue-400 mt-2 italic uppercase">WH-2</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
                <section className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                    <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-blue-500"><BrainCircuit size={16} /> Forecast Engine</h3>
                    <div className="space-y-4">
                        <Dropdown label="Category" value={selectedCategory} onChange={setSelectedCategory} options={categories} />
                        <Dropdown label="Product SKU" value={selectedProduct} onChange={setSelectedProduct} options={['Book_1', 'Toy_1', 'Electronic_1', 'Cloth_1']} />
                        <Input label="Current Stock" value={currentStock} onChange={setCurrentStock} type="number" />
                        <Input label="Base Price" value={basePrice} onChange={setBasePrice} type="number" />
                        <button onClick={runAIForecast} className="w-full py-4 bg-blue-600 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-blue-500/20">
                            {isSyncing ? "Syncing API..." : "Calculate AI Prediction"}
                        </button>
                    </div>
                </section>
                {forecastResult && (
                  <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-3xl animate-in slide-in-from-top">
                    <p className="text-2xl font-black text-white">${forecastResult?.price || '0.00'}</p>
                    <p className="text-[10px] font-black uppercase text-blue-400 mt-1">Suggested Price</p>
                  </div>
                )}
            </div>

            <div className="lg:col-span-8 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <MiniKpi label="Financial Risk" value={auditSummary?.financial_loss || 0} color="text-red-500" />
                    <MiniKpi label="Dead Stock" value={auditSummary?.dead_stock || 0} color="text-purple-500" />
                    <MiniKpi label="Market Gap" value={auditSummary?.market_gaps || 0} color="text-blue-500" />
                    <MiniKpi label="Revenue Gap" value={auditSummary?.revenue_gaps || 0} color="text-orange-500" />
                </div>
                <section className="bg-white/5 border border-white/10 p-8 rounded-3xl min-h-[300px]">
                    <h3 className="text-lg font-black uppercase tracking-tighter mb-6 flex items-center gap-2 underline decoration-blue-500 underline-offset-8">Intelligence Analysis</h3>
                    {auditReport ? <div className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">{auditReport}</div> : <p className="text-slate-600 text-xs italic">Awaiting AI generation for {selectedStore}...</p>}
                </section>
            </div>
          </div>
        </main>
      </div>

      {/* ANOMALY MODAL (Filtered to specific store) */}
      {isAnomalyModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsAnomalyModalOpen(false)}></div>
          <div className="relative bg-[#0a0a0c] border border-white/10 w-full max-w-[95%] h-full max-h-[90vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4 text-red-500"><ShieldAlert size={32} /><h3 className="text-3xl font-black uppercase tracking-tighter italic">{selectedStore} Anomalies</h3></div>
              <button onClick={() => setIsAnomalyModalOpen(false)} className="p-4 bg-white/5 hover:bg-red-500 rounded-2xl transition-all"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {anomalies.map((anomaly, i) => (
                    <div key={i} className="group bg-white/[0.02] border border-white/5 p-6 rounded-[1.5rem] flex items-center justify-between hover:bg-white/[0.04]">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-black rounded-xl border border-white/10 flex items-center justify-center text-red-500 font-black italic text-xs uppercase">FAULT</div>
                            <div>
                                <p className="text-sm font-black uppercase text-white tracking-tight">{anomaly?.product_name || 'N/A'}</p>
                                <div className="flex gap-2 mt-1">
                                    {anomaly?.fault_loss_sale === 1 && <span className="text-[8px] font-black px-2 py-0.5 bg-red-500/10 text-red-500 rounded uppercase">Negative Margin</span>}
                                    {anomaly?.fault_dead_stock === 1 && <span className="text-[8px] font-black px-2 py-0.5 bg-purple-500/10 text-purple-500 rounded uppercase">Dead Stock</span>}
                                </div>
                            </div>
                        </div>
                        <p className="text-lg font-black text-red-500 italic uppercase italic">CRITICAL</p>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// HELPER COMPONENTS
const NavItem = ({ icon, label, active }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-white'}`}>
    {icon} <span className="text-xs font-black uppercase tracking-widest">{label}</span>
  </div>
);

const StatCard = ({ label, value, trend, icon, onClick, clickable }) => (
  <div onClick={onClick} className={`bg-white/5 border border-white/10 p-5 rounded-2xl flex justify-between items-start transition-all ${clickable ? 'cursor-pointer hover:bg-white/10' : ''}`}>
    <div><p className="text-[10px] font-black uppercase text-slate-500">{label}</p><p className="text-2xl font-black mt-2 italic">{value}</p><span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{trend}</span></div>
    <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
  </div>
);

const MiniKpi = ({ label, value, color }) => (
    <div className="bg-white/5 border border-white/10 p-4 rounded-xl"><p className="text-[8px] font-black uppercase text-slate-500 mb-1">{label}</p><p className={`text-xl font-black ${color} italic`}>{value}</p></div>
);

const Input = ({ label, value, onChange, type }) => (
  <div><label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">{label}</label><input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs mt-1 text-white focus:outline-none focus:border-blue-500" /></div>
);

const Dropdown = ({ label, value, onChange, options }) => (
  <div><label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">{label}</label><select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs mt-1 text-white focus:outline-none focus:border-blue-500">{options.map(opt => <option key={opt} value={opt} className="bg-[#0a0a0c]">{opt}</option>)}</select></div>
);

export default Store2Dashboard;