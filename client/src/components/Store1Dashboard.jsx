import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom'; // Integrated for Chat navigation
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar, PolarRadiusAxis } from 'recharts';
import { 
  TrendingUp, BarChart3, ShieldCheck, BrainCircuit, Activity,
  Truck, AlertCircle, Eye, Gauge, ArrowRight, FileText, 
  DollarSign, Package, AlertTriangle, LayoutDashboard, Database, 
  Menu, X, Download, ShieldAlert, Layers, ShoppingCart, 
  ArrowDownCircle, ArrowUpCircle, Scale, Zap, Boxes, MessageSquare, LineChart
} from 'lucide-react';

const Store1Dashboard = () => {
  const navigate = useNavigate();
  const [userData] = useState(() => {
    const savedUser = localStorage.getItem('user'); 
    return savedUser ? JSON.parse(savedUser) : { role: 'store1', name: 'Operator' };
  });

  const selectedStore = 'WH-1';
  const categories = ['Books', 'Toys', 'Electronics', 'Clothes'];
  const generateProducts = (prefix, count) =>
  Array.from({ length: count }, (_, i) => `${prefix}_${i + 1}`);

  const productMap = {
    Books: generateProducts("Book", 20),
    Toys: generateProducts("Toy", 20),
    Electronics: generateProducts("Electronic", 20),
    Clothes: generateProducts("Cloth", 20),
};

  const COLORS = ['#4F46E5', '#8B5CF6', '#EC4899', '#10B981'];

  // State Management
  const [selectedCategory, setSelectedCategory] = useState('Books');
  const [selectedProduct, setSelectedProduct] = useState('Book_1');
  const [currentStock, setCurrentStock] = useState(50);
  const [basePrice, setBasePrice] = useState(100.00);
  const [competitorPrice, setCompetitorPrice] = useState(105);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [inventoryLog, setInventoryLog] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [auditSummary, setAuditSummary] = useState({ financial_loss: 0, dead_stock: 0, market_gaps: 0, revenue_gaps: 0 });
  const [anomalies, setAnomalies] = useState([]);
  const [forecastResult, setForecastResult] = useState(null);
  const [isAnomalyModalOpen, setIsAnomalyModalOpen] = useState(false);

  const utilizationData = [
    { subject: 'Space Used', A: 120, fullMark: 150 },
    { subject: 'Efficiency', A: 98, fullMark: 150 },
    { subject: 'Access Speed', A: 86, fullMark: 150 },
    { subject: 'Safety', A: 140, fullMark: 150 },
    { subject: 'Organization', A: 85, fullMark: 150 },
  ];

  useEffect(() => { setSelectedProduct(productMap[selectedCategory][0]); }, [selectedCategory]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invRes = await axios.get(`http://localhost:3002/StockData/inventory?store=${selectedStore}&item=${selectedProduct}`);
        const data = invRes.data || [];
        setInventoryLog(data);
        setTotalRevenue(data.reduce((sum, row) => sum + (parseFloat(row.revenue) || 0), 0));
        const auditRes = await axios.get(`http://localhost:3002/api/audit-summary?warehouse=${selectedStore}&category=${selectedCategory}`);
        setAuditSummary(auditRes.data || { financial_loss: 0, dead_stock: 0, market_gaps: 0, revenue_gaps: 0 });
        const anomalyRes = await axios.get(`http://localhost:3002/api/anomalies`);
        setAnomalies((anomalyRes.data || []).filter(a => a.warehouse_id === selectedStore));
      } catch (error) { console.error("API Error", error); }
    };
    fetchData();
  }, [selectedStore, selectedProduct, selectedCategory]);

  const runAIForecast = async () => {
    setIsSyncing(true);
    try {
      const response = await axios.post(`http://localhost:3002/api/predict`, {
        store: selectedStore, item: selectedProduct, stock: currentStock, price: basePrice
      });
      setForecastResult(response.data);
    } catch (error) { console.error(error); } finally { setIsSyncing(false); }
    try {
      const response = await axios.get(`http://localhost:3002/competitor-price?store=${selectedStore}&item=${selectedProduct}&stock=${currentStock}&price=${basePrice}`);
      setCompetitorPrice(response.data.competitor_price); 
    } catch (error) { console.error(error); } finally { setIsSyncing(false); }
  };

  // FULL BI REPORT GENERATOR
  const generateFullBIReport = async () => {
    setIsSyncing(true);
    try {
      const doc = new jsPDF();
      const timestamp = new Date().toLocaleString();

      // HEADER
      doc.setFillColor(79, 70, 229);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text("SMARTSTOCK BUSINESS INTELLIGENCE", 15, 20);
      doc.setFontSize(10);
      doc.text(`Warehouse Terminal: ${selectedStore} | Report Generated: ${timestamp}`, 15, 30);

      // SECTION 1: OVERALL DASHBOARD SUMMARY
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.text("1. Executive Dashboard Summary", 15, 50);
      doc.setFontSize(10);
      doc.text(`Total Warehouse Revenue: $${totalRevenue.toLocaleString()}`, 20, 60);
      doc.text(`Total SKU Inventory: ${inventoryLog.length} Items`, 20, 65);
      doc.text(`Active System Anomalies: ${anomalies.length} Flags`, 20, 70);

      // SECTION 2: STOCK PERFORMANCE
      doc.setFontSize(14);
      doc.text("2. Stock Performance Metrics", 15, 85);
      doc.setFontSize(10);
      doc.text(`Financial Risk Exposure: $${auditSummary.financial_loss}`, 20, 95);
      doc.text(`Dead Stock Count: ${auditSummary.dead_stock} units`, 20, 100);
      doc.text(`Supply/Market Gaps: ${auditSummary.market_gaps} instances`, 20, 105);

      // SECTION 3: OPERATIONAL EFFICIENCY (FROM RADAR)
      doc.setFontSize(14);
      doc.text("3. Operational Efficiency (AI Derived)", 15, 120);
      utilizationData.forEach((item, i) => {
        doc.text(`${item.subject}: ${item.A} / ${item.fullMark}`, 20, 130 + (i * 5));
      });

      // SECTION 4: AI FORECAST RESULTS
      if (forecastResult) {
        doc.setFontSize(14);
        doc.text("4. AI Predictive Analytics Result", 15, 165);
        doc.setFontSize(10);
        doc.text(`Analyzed Asset: ${selectedProduct}`, 20, 175);
        doc.text(`AI Suggested Pricing: $${forecastResult.price}`, 20, 180);
        doc.text(`Predicted Market Demand: ${forecastResult.demand} units`, 20, 185);
        doc.text(`Competitor Comparison: ${forecastResult.price <= competitorPrice ? 'Under Market (Advantage)' : 'Above Market'}`, 20, 190);
      }

      // SECTION 5: FAULTY RECORDS
      if (anomalies.length > 0) {
        doc.addPage();
        doc.setFontSize(14);
        doc.text("5. Detailed Faulty Product Log", 15, 20);
        anomalies.slice(0, 15).forEach((item, i) => {
          doc.setFontSize(9);
          doc.text(`${i + 1}. ${item.product_name} - SKU: ${item.transaction_id || 'N/A'} [FAULT DETECTED]`, 15, 35 + (i * 8));
        });
      }

      doc.save(`Overall Store1 Report_${selectedStore}.pdf`);
    } catch (error) { console.error("PDF Gen Failed", error); } finally { setIsSyncing(false); }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transition-all ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100">
              <Database size={22} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 italic uppercase">SmartStock</h1>
          </div>
          <nav className="space-y-1 flex-1">
            <NavItem icon={<LayoutDashboard size={20}/>} label="Overview" active onClick={() => setSidebarOpen(false)} />
            <NavItem icon={<ShieldCheck size={20}/>} label="Anomaly Detection Report" onClick={() => setIsAnomalyModalOpen(true)} />
            <NavItem icon={<FileText size={20}/>} label="Generate Report" onClick={generateFullBIReport} />
            <NavItem icon={<MessageSquare size={20}/>} label="System Chat" onClick={() => navigate('/user-chat')} />
          </nav>
          <div className="mt-auto p-5 bg-slate-50 border border-slate-100 rounded-3xl">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">OP</div>
                <div>
                   <p className="text-xs font-bold text-slate-800">{userData.name}</p>
                   <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Auth Store 1</p>
                </div>
             </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* NAVBAR */}
        <nav className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"><Menu size={20}/></button>
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <Activity size={14} className="text-indigo-600" /> Operational Terminal / <span className="text-slate-900">{selectedStore}</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={generateFullBIReport} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-[11px] uppercase shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                <Download size={14}/> Full Intelligence Report
             </button>
          </div>
        </nav>

        <main className="p-8 lg:p-12 space-y-10 overflow-y-auto">
          {/* STATS SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard label="Calculated Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={<DollarSign/>} color="indigo" />
            <StatCard label="Anomaly Count" value={anomalies.length} icon={<AlertTriangle/>} color="rose" onClick={() => setIsAnomalyModalOpen(true)} clickable />
            <StatCard label="Total Stocks" value={inventoryLog.length} icon={<Package/>} color="emerald" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* RADAR CHART */}
            <div className="lg:col-span-5 bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                <Activity size={16} className="text-indigo-600" /> Operational Efficiency
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={utilizationData}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="subject" fontSize={11} fontWeight="bold" />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} fontSize={9} stroke="#94A3B8" /> 
                    <Radar name="Usage" dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.5} dot={{ r: 4, fill: "#fff", stroke: "#4F46E5", strokeWidth: 2 }} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* PREDICTOR */}
            <div className="lg:col-span-7 bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-8 flex items-center gap-2"><BrainCircuit size={16} /> AI Forecast Engine</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-5">
                  <Dropdown label="Sector" value={selectedCategory} onChange={setSelectedCategory} options={categories} />
                  <Dropdown label="Asset" value={selectedProduct} onChange={setSelectedProduct} options={productMap[selectedCategory]} />
                  <div className="flex gap-4">
                    <Input label="Stock" value={currentStock} onChange={setCurrentStock} type="number" />
                    <Input label="Price" value={basePrice} onChange={setBasePrice} type="number" />
                  </div>
                  <button onClick={runAIForecast} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-indigo-100">
                    {isSyncing ? "Syncing Logic..." : "Sync Intelligence"}
                  </button>
                </div>
                <div>
                  {forecastResult ? (
                    <div className="bg-slate-50 border border-slate-200 p-8 rounded-[2rem] space-y-6 text-center">
                       <div className="border-b border-slate-200 pb-4">
                          <p className="text-[10px] font-black text-slate-400 uppercase">AI Predicted Demand</p>
                          <p className="text-3xl font-black text-indigo-600">{forecastResult.demand}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase">AI Prediction Accuracy</p>
                          <p className="text-3xl font-black text-indigo-600">{forecastResult.confidence}%</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase">Competitor Price</p>
                          <p className="text-3xl font-black text-indigo-600">${competitorPrice}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase">AI Target Price</p>
                          <p className="text-3xl font-black text-indigo-600">${forecastResult.predicted_upper}</p>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${forecastResult.price <= competitorPrice ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                             {forecastResult.price <= competitorPrice ? 'Competitive Advantage' : 'Price Overflow'}
                          </span>
                          <p className="text-[10px] font-bold text-slate-400 tracking-tighter italic">Market Demand: {forecastResult.demand}u</p>
                       </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-8 text-center text-slate-300">
                       <Activity size={32} className="mb-2 opacity-20" />
                       <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Command</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* WORKFLOW FEED */}
          <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
             <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-8 flex items-center gap-2"><Zap size={16} className="text-amber-400"/> Automation Logs</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AutomationRow label={`Restock order triggered for ${selectedProduct}`} context="Operational Efficiency" />
                <AutomationRow label={`Forensic audit recalibrated for ${selectedCategory}`} context="Data Integrity" />
             </div>
          </div>
        </main>
      </div>

      {/* ANOMALY MODAL */}
      {isAnomalyModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsAnomalyModalOpen(false)}></div>
          <div className="relative bg-white border border-slate-200 w-full max-w-[1000px] h-full max-h-[85vh] rounded-[3rem] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-5 text-rose-500">
                <ShieldAlert size={36} /><h3 className="text-3xl font-black uppercase tracking-tighter italic text-slate-800">Anomaly Center</h3>
              </div>
              <button onClick={() => setIsAnomalyModalOpen(false)} className="p-4 bg-white text-slate-400 hover:text-rose-500 rounded-2xl shadow-sm transition-all"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 space-y-12">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                 <ModalStat label="Financial Loss" value={auditSummary?.financial_loss || 0} color="rose" />
                 <ModalStat label="Dead Stock" value={auditSummary?.dead_stock || 0} color="indigo" />
                 <ModalStat label="Market Gap" value={auditSummary?.market_gaps || 0} color="blue" />
                 <ModalStat label="Revenue Gap" value={auditSummary?.revenue_gaps || 0} color="orange" />
              </div>
              <div className="bg-slate-900 rounded-[2.5rem] p-10 flex flex-col md:flex-row justify-between items-center text-white gap-8">
                <div>
                    <h4 className="text-2xl font-black uppercase italic text-blue-400 tracking-tighter">Export Anomaly Document</h4>
                    <p className="text-sm text-slate-400 mt-2 uppercase tracking-widest font-semibold">Comprehensive Stock & AI Forecast Analysis</p>
                </div>
                <button onClick={generateFullBIReport} className="flex items-center gap-4 bg-indigo-600 hover:bg-indigo-500 px-10 py-5 rounded-2xl font-black uppercase text-xs shadow-xl transition-all">
                    <Download size={22}/> Export PDF Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// UI COMPONENTS
const StatCard = ({ label, value, icon, color, onClick, clickable }) => {
  const styles = { indigo: "indigo", rose: "rose", emerald: "emerald" };
  return (
    <div onClick={onClick} className={`bg-white border border-slate-200 p-8 rounded-[2.5rem] flex items-center gap-6 transition-all shadow-sm ${clickable ? 'cursor-pointer hover:shadow-indigo-100 hover:translate-y-[-5px]' : ''}`}>
       <div className={`p-5 bg-${color}-50 text-${color}-600 rounded-3xl border border-${color}-100`}>{icon}</div>
       <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{label}</p><p className="text-3xl font-extrabold text-slate-800 tracking-tighter italic">{value}</p></div>
    </div>
  );
};

const AutomationRow = ({ label, context }) => (
  <div className="p-5 bg-slate-50 border border-slate-100 rounded-3xl flex justify-between items-center group hover:bg-white transition-all">
     <div className="flex items-center gap-4">
        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></div>
        <p className="text-xs font-bold text-slate-700 italic tracking-tight">{label}</p>
     </div>
     <span className="text-[9px] font-black uppercase text-indigo-400 px-3 py-1 bg-white rounded-full border border-indigo-50 shadow-sm">{context}</span>
  </div>
);

const ModalStat = ({ label, value, color }) => (
  <div className={`bg-${color}-50 border border-${color}-100 p-8 rounded-[2rem] flex flex-col items-center text-center`}>
      <p className={`text-3xl font-black italic text-${color}-600 mb-1 tracking-tighter`}>{value}</p>
      <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{label}</p>
  </div>
);

const NavItem = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-4 px-6 py-4 rounded-2xl cursor-pointer transition-all ${active ? 'bg-indigo-600 text-white shadow-indigo-100 shadow-xl' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}>
    {icon} <span className="text-[11px] font-bold uppercase tracking-[0.15em]">{label}</span>
  </div>
);

const Input = ({ label, value, onChange, type }) => (
  <div className="flex-1"><label className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-2 block ml-1">{label}</label><input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-slate-50 border border-indigo-50 rounded-2xl p-4 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-400 transition-colors shadow-inner" /></div>
);

const Dropdown = ({ label, value, onChange, options }) => (
  <div className="w-full"><label className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-2 block ml-1">{label}</label><select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-slate-50 border border-indigo-50 rounded-2xl p-4 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-400 appearance-none cursor-pointer">{options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
);

export default Store1Dashboard;