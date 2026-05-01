import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

import { useNavigate } from 'react-router-dom';
import bgImage from "../images/bg.jpg"; 
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { 
  LayoutDashboard, Store, FileText, MessageSquare, 
  Package, DollarSign, AlertTriangle, Activity, Database,
  ChevronDown, Menu, TrendingUp, BrainCircuit, Boxes
} from 'lucide-react';

import TopNavbar from './TopNavbar';


const AdminDashboard = () => {
  
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedView, setSelectedView] = useState('overview'); 
  const [isStoreDropdownOpen, setIsStoreOpen] = useState(false);
  const [isAnomalyModalOpen, setIsAnomalyModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [revenue, setRevenue] = useState(0);
  const [marketAuditData, setMarketAuditData] = useState([]);
  const [stockData, setStockData] = useState({
  total: 0,
  breakdown: {}
});
  const [warehouseRevenue, setWarehouseRevenue] = useState({});
  const [globalDistribution, setGlobalDistribution] = useState([]);

  const getWarehouseStockData = (whId) => {
  const data = warehouseStock?.[whId] || {};

  return Object.entries(data).map(([category, stock]) => ({
    category,
    stock: Number(stock)
  }));
};
  const categories = ['Books', 'Toys', 'Electronics', 'Clothes'];
  const [warehouseStock, setWarehouseStock] = useState({});
  const [loadingRow, setLoadingRow] = useState(null);
  const [strategicData, setStrategicData] = useState({
    kpis: { totalStocks: 2450, totalRevenue: 85400, totalAnomalies: 14 },
    globalDistribution: [
      { name: 'Warehouse 01', value: 850 },
      { name: 'Warehouse 02', value: 600 },
      { name: 'Warehouse 03', value: 500 },
      { name: 'Warehouse 04', value: 500 }
    ],
    categoryDistribution: [
      { name: 'Books', value: 350 },
      { name: 'Toys', value: 200 },
      { name: 'Electronics', value: 150 },
      { name: 'Clothes', value: 150 }
    ],
    marketBenchmarking: [
  { id: 'WH-1', category: '', financial_loss: 0, data_gaps: 0, dead_stock: 0, market_gaps: 0 },
  { id: 'WH-2', category: '', financial_loss: 0, data_gaps: 0, dead_stock: 0, market_gaps: 0 },
  { id: 'WH-3', category: '', financial_loss: 0, data_gaps: 0, dead_stock: 0, market_gaps: 0 },
  { id: 'WH-4', category: '', financial_loss: 0, data_gaps: 0, dead_stock: 0, market_gaps: 0 }
],
    warehouseMarketData: [
      { category: 'Books', avgComp: 105, aiPredict: 104, demand: 450, trend: '+12.5%' },
      { category: 'Toys', avgComp: 92, aiPredict: 90, demand: 320, trend: '+5.2%' },
      { category: 'Electronics', avgComp: 450, aiPredict: 445, demand: 150, trend: '-2.1%' },
      { category: 'Clothes', avgComp: 65, aiPredict: 62, demand: 580, trend: '+18.4%' }
    ],
    // Category-wise anomalies for the Warehouse Sub-view
    categoryAnomalies: [
      { label: 'Books', count: '01', color: 'rose' },
      { label: 'Clothes', count: '02', color: 'amber' },
      { label: 'Electronics', count: '01', color: 'indigo' },
      { label: 'Toys', count: '00', color: 'emerald' }
    ]
  });
  const [utilizationData, setUtilizationData] = useState([]);
  
  useEffect(() => {
  const fetchUtilization = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3002/ai/space-utilization"
      );

      const formatted = res.data.data.map((item) => ({
        warehouse: item.warehouse,
        utilization: item.utilization,
        status: getUtilizationStatus(item.utilization)
      }));

      setUtilizationData(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  fetchUtilization();
}, []);
  useEffect(() => {
  const fetchWarehouseStock = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3002/stock/warehouse-category-stock"
      );

      setWarehouseStock(res.data || {});

      
    } catch (err) {
      console.error("Error fetching warehouse stock:", err);
    }
  };

  fetchWarehouseStock();
}, []);
useEffect(() => {
  const fetchGlobalStock = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3002/stock/total-stock"
      );

      const breakdown = res.data?.breakdown || {};

      // convert object → chart array
      const formatted = Object.entries(breakdown).map(
        ([wh, value]) => ({
          name: `Warehouse ${wh.split("-")[1]}`,
          value: Number(value)
        })
      );

      setGlobalDistribution(formatted);

      
    } catch (err) {
      console.error("Global stock error:", err);
    }
  };

  fetchGlobalStock();
}, []);
  useEffect(() => {
  const loadWarehouseRevenue = async () => {
    try {
      const warehouses = ['WH-1', 'WH-2', 'WH-3', 'WH-4'];

      const results = await Promise.all(
        warehouses.map(async (wh) => {
          const res = await axios.get(
            `http://localhost:3002/revenue/warehouse/${wh}`
          );

        

          return {
            wh,
            revenue: res.data?.totalRevenue ?? 0
          };
        })
      );

      const revenueMap = {};
      results.forEach(item => {
        revenueMap[item.wh] = Number(item.revenue);
      });

      

      setWarehouseRevenue(revenueMap);

    } catch (err) {
      console.error("Failed loading warehouse revenue:", err);
    }
  };

  loadWarehouseRevenue();
}, []);
  useEffect(() => {
  fetchMarketAudit("WH-1");
}, []);
  useEffect(() => {
  const fetchStock = async () => {
    try {
      const res = await axios.get('http://localhost:3002/stock/total-stock');

      setStockData({
        total: res.data.totalStock,
        breakdown: res.data.breakdown || {}
      });
   
    } catch (err) {
      console.error(err);
    }
  };

  fetchStock();


  const fetchRevenue = async () => {
    try {
      const res = await axios.get('http://localhost:3002/total-revenue');
      setRevenue(res.data.totalRevenue || 0);
      
    } catch (err) {
      console.error(err);
    }
  };

  fetchRevenue();
}, []);

  const COLORS = ['#4F46E5', '#8B5CF6', '#EC4899', '#10B981'];
  const whMap = { 'WH-1': 'Books', 'WH-2': 'Toys', 'WH-3': 'Electronics', 'WH-4': 'Clothes' };

  useEffect(() => {
    const fetchAdminIntelligence = async () => {
      try {
        const res = await axios.get('http://localhost:3002/strategic-intelligence');
        if (res.data) setStrategicData(prev => ({ ...prev, ...res.data }));
      } catch (err) { console.warn("Using fallback intelligence data."); }
    };
    fetchAdminIntelligence();
  }, []);

  const handleReportAction = async () => {
  const doc = new jsPDF();
  const timestamp = new Date().toLocaleString();
  const isGlobal = selectedView === 'overview';

  const categories = ['Books', 'Toys', 'Electronics', 'Clothes'];

  // helper → fetch all category audit data
  const fetchAllAudit = async (store) => {
    try {
      const results = await Promise.all(
        categories.map(async (cat) => {
          const res = await axios.get(
            `http://localhost:3002/api/audit-summary?store=${store}&category=${cat}`
          );
          return {
            category: cat,
            data: res.data || {}
          };
        })
      );
      return results;
    } catch (err) {
      console.error("Audit fetch error:", err);
      return [];
    }
  };

  if (isGlobal) {
    // ================= GLOBAL REPORT =================

    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 50, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("GLOBAL PERFORMANCE REPORT", 15, 28);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Issued: ${timestamp}`, 15, 40);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

    doc.text(`Total Revenue: $${Number(revenue || 0).toLocaleString()}`, 15, 60);
    doc.text(`Total Stock: ${Number(stockData?.total || 0).toLocaleString()}`, 15, 68);

    let y = 85;

    doc.text("Warehouse Revenue:", 15, y);
    Object.entries(warehouseRevenue || {}).forEach(([wh, rev]) => {
      y += 7;
      doc.text(`${wh}: $${Number(rev || 0).toLocaleString()}`, 20, y);
    });

    y += 10;

    doc.text("Space Utilization:", 15, y);
    (utilizationData || []).forEach((u) => {
      y += 7;
      doc.text(`${u.warehouse}: ${u.utilization}% (${u.status})`, 20, y);
    });

    // ================= GLOBAL AUDIT (ALL 4 CATEGORIES) =================
    y += 15;
    doc.text("GLOBAL AUDIT SUMMARY (ALL CATEGORIES)", 15, y);

    const auditData = await fetchAllAudit("GLOBAL");

    auditData.forEach((item) => {
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.text(item.category, 15, y);

      doc.setFont("helvetica", "normal");
      y += 7;

      doc.text(`Financial Loss: ${item.data.financial_loss || 0}`, 20, y);
      y += 7;
      doc.text(`Data Gaps: ${item.data.data_gaps || 0}`, 20, y);
      y += 7;
      doc.text(`Dead Stock: ${item.data.dead_stock || 0}`, 20, y);
      y += 7;
      doc.text(`Market Gaps: ${item.data.market_gaps || 0}`, 20, y);
    });

  } else {
    // ================= WAREHOUSE REPORT =================

    const whStock = stockData?.breakdown?.[selectedView] || 0;
    const whRevenue = warehouseRevenue?.[selectedView] || 0;

    doc.setFillColor(31, 41, 55);
    doc.rect(0, 0, 210, 50, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(`Warehouse Report: ${selectedView}`, 15, 28);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Issued: ${timestamp}`, 15, 40);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

    doc.text(`Total Stock: ${Number(whStock).toLocaleString()}`, 15, 60);
    doc.text(`Revenue: $${Number(whRevenue).toLocaleString()}`, 15, 68);

    let y = 85;

    doc.text("Category-wise Stock:", 15, y);

    (getWarehouseStockData(selectedView) || []).forEach((cat) => {
      y += 7;
      doc.text(`${cat.category}: ${cat.stock}`, 20, y);
    });

    // ================= AUDIT SUMMARY (ALL 4 CATEGORIES FIXED) =================
    y += 15;
    doc.text("AUDIT SUMMARY (ALL CATEGORIES)", 15, y);

    const auditData = await fetchAllAudit(selectedView);

    auditData.forEach((item) => {
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.text(item.category, 15, y);

      doc.setFont("helvetica", "normal");
      y += 7;

      doc.text(`Financial Loss: ${item.data.financial_loss || 0}`, 20, y);
      y += 7;
      doc.text(`Data Gaps: ${item.data.data_gaps || 0}`, 20, y);
      y += 7;
      doc.text(`Dead Stock: ${item.data.dead_stock || 0}`, 20, y);
      y += 7;
      doc.text(`Market Gaps: ${item.data.market_gaps || 0}`, 20, y);
    });
  }

  doc.save(`${selectedView}_Report.pdf`);
  setIsReportModalOpen(false);
};
   const getUtilizationStatus = (value) => {
  if (value > 100) return "Overloaded";
  if (value >= 80) return "Risky";
  if (value >= 40) return "Ideal";
  return "Underused";
};
const fetchMarketAudit = async (warehouseId) => {
  try {
    const res = await axios.get(
      `http://localhost:3002/market-audit/market-audit/${warehouseId}`
    );
   
    setMarketAuditData(res.data || []);
    
  } catch (err) {
    console.error("Market audit error:", err);
  }
};
  const fetchAuditSummary = async (store, category, index) => {
  try {
    setLoadingRow(index); // ✅ START loading

    const res = await axios.get(
      `http://localhost:3002/api/audit-summary?store=${store}&category=${category}`
    );

    const data = res.data;

    const updated = [...strategicData.marketBenchmarking];

    updated[index] = {
      ...updated[index],
      category,
      financial_loss: data.financial_loss || 0,
      data_gaps: data.data_gaps || 0,
      dead_stock: data.dead_stock || 0,
      market_gaps: data.market_gaps || 0
    };

    setStrategicData(prev => ({
      ...prev,
      marketBenchmarking: updated
    }));

  } catch (err) {
    console.error("Audit API error:", err);
  } finally {
    setLoadingRow(null); // ✅ STOP loading
  }
};

const fetchWarehouseRevenue = async (whId) => {
  try {
    const res = await axios.get(
      `http://localhost:3002/revenue/warehouse/${whId}`
    );

    return res.data.total_revenue || 0; // return value
  } catch (err) {
    console.error("Warehouse revenue error:", err);
    return 0;
  }
};
  const renderWarehouseSubView = (id) => (
    
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div className="flex items-center justify-between">
         <h2 className="text-xl font-black uppercase italic text-slate-800 tracking-tighter">Strategic Analysis: {id}</h2>
         <span className="px-4 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase">Terminal Logic Active</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard label="Calculated Revenue" value={
  warehouseRevenue[id] != null
    ? `$${Number(warehouseRevenue[id]).toLocaleString()}`
    : "Loading..."
} icon={<DollarSign/>} color="indigo" />
        <StatCard label="Total Stocks" value={stockData.breakdown[id]} icon={<Package/>} color="emerald" />
        {/* Clickable Anomaly Count for Sub-view Category Breakdown */}
        
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-xs font-black uppercase text-slate-400 mb-8 flex items-center gap-2"><Boxes size={16}/> Stock Volume per Category</h3>
          <div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={getWarehouseStockData(id)}  innerRadius={60} outerRadius={90}
    paddingAngle={5}
    dataKey="stock"
    nameKey="category"
  >
    {getWarehouseStockData(id).map((entry, index) => (
      <Cell key={index} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip formatter={(value, name, props) => [
  value,
  props.payload.category
]} />
 <Legend
  formatter={(value, entry, index) =>
    getWarehouseStockData(id)[index]?.category
  }
/>
</PieChart></ResponsiveContainer></div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-xs font-black uppercase text-slate-400 mb-8 flex items-center gap-2"><BrainCircuit size={16} className="text-indigo-600"/> Market Intelligence Audit</h3>
          <div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={marketAuditData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" /><XAxis dataKey="category" fontSize={10} fontWeight="bold" /><YAxis fontSize={10} /><Tooltip cursor={{fill: '#f8fafc'}} /><Legend /><Bar
  name="Avg Competitor Price"
  dataKey="competitor_price"
  fill="#94a3b8"
  radius={[4, 4, 0, 0]}
/>

<Bar
  name="Avg Price"
  dataKey="unit_price"
  fill="#4F46E5"
  radius={[4, 4, 0, 0]}
/></BarChart></ResponsiveContainer></div>
        </div>
      </div>
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
  <h3 className="text-xs font-black uppercase text-slate-400 mb-6 tracking-widest">
    Category-wise Stock
  </h3>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    {getWarehouseStockData(id).map((item, i) => (
      <div
        key={i}
        className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center hover:shadow-md transition"
      >
        {/* CATEGORY NAME */}
        <p className="text-[10px] font-black text-indigo-600 uppercase mb-2">
          {item.category}
        </p>

        {/* STOCK VALUE */}
        <p className="text-2xl font-black text-slate-800">
          {item.stock.toLocaleString()}
        </p>

        {/* LABEL */}
        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">
          Total Stock Units
        </p>
      </div>
    ))}
  </div>
</div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <StatCard 
  label="Total Stock" 
  value={stockData.total} 
  icon={<Package/>} 
  color="indigo" 
  breakdown={stockData.breakdown}
/>
        <StatCard label="Total Revenue" value={`$${revenue.toLocaleString()}`} icon={<DollarSign/>} color="emerald" />
        {/* Clickable Total Anomalies for Global Breakdown */}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-xs font-black uppercase text-slate-400 mb-8 flex items-center gap-2"><Store size={16} /> Global Store Distribution</h3>
          <div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={globalDistribution} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
  {globalDistribution.map((entry, index) => (
    <Cell key={index} fill={COLORS[index % COLORS.length]} />
  ))}
</Pie><Tooltip /><Legend layout="vertical" align="right" verticalAlign="middle" /></PieChart></ResponsiveContainer></div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-xs font-black uppercase text-slate-400 mb-8 flex items-center gap-2"><Boxes size={16} /> Space Utilization AI</h3>
          <div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><RadarChart cx="50%" cy="50%" outerRadius="80%" data={utilizationData}>
  <PolarGrid />
  <PolarAngleAxis dataKey="warehouse" />
  <Radar
  name="Utilization %"
  dataKey="utilization"
  stroke="#4F46E5"
  fill="#4F46E5"
  fillOpacity={0.4}
/>
  <Tooltip
  formatter={(value, name, props) => [
    `${value}%`,
    `Status: ${props.payload.status}`
  ]}
/>
</RadarChart></ResponsiveContainer></div>
        </div>
      </div>
      <section className="bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"> Anomalies Analysis</h3>
            
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-3">
                <thead><tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest"><th className="px-6 py-2">Warehouse</th><th className="px-6 py-2">Category</th><th className="px-6 py-2">financial_loss</th><th className="px-6 py-2">data_gaps</th><th className="px-6 py-2">dead_stock</th><th className="px-6 py-2 text-right">market_gaps</th></tr></thead>
                <tbody className="text-xs font-bold">{strategicData.marketBenchmarking.map((row, i) => (<tr key={i} className="bg-white hover:bg-indigo-50/30 transition-colors"><td className="px-6 py-5 rounded-l-2xl border-y border-l border-slate-50">{row.id}</td><td className="px-6 py-5 border-y border-slate-50">
  <select
  disabled={loadingRow === i} // ✅ DISABLE CURRENT ROW
  className={`bg-transparent border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold focus:outline-none ${
    loadingRow === i ? 'opacity-50 cursor-not-allowed' : ''
  }`}
  value={row.category || ''}
  onChange={(e) => {
    const selectedCategory = e.target.value;
    fetchAuditSummary(row.id, selectedCategory, i);
  }}
>
  
    <option value="">Select</option>
    {categories.map((cat) => (
      <option key={cat} value={cat}>{cat}</option>
    ))}
  </select>
</td><td className="px-6 py-5 border-y border-slate-50">
  {row.financial_loss}
</td><td className="px-6 py-5 border-y border-slate-50">
  {row.data_gaps}
</td>
<td className="px-6 py-5 border-y border-slate-50">
  {row.dead_stock}
</td> <td className="px-6 py-5 border-y border-slate-50 text-right">
  {row.market_gaps}
</td></tr>))}</tbody>
            </table>
        </div>
      </section>
    </div>
  ); 

  return (
    <div className="flex min-h-screen font-sans relative overflow-hidden" 
         style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px] z-0"></div>

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-md border-r border-slate-200 transition-all ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg text-white"><Database size={22} /></div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 uppercase italic">Admin Dashboard</h1>
          </div>
          <nav className="space-y-1 flex-1">
            <NavItem icon={<LayoutDashboard size={20}/>} label="Overview" active={selectedView === 'overview'} onClick={() => setSelectedView('overview')} />
            <div className="relative">
              <button onClick={() => setIsStoreOpen(!isStoreDropdownOpen)} className="w-full flex items-center justify-between p-4 rounded-2xl text-slate-400 hover:bg-indigo-50 transition-all font-bold uppercase text-[11px]">
                 <div className="flex items-center gap-4"><Store size={20}/> <span>Warehouses</span></div>
                 <ChevronDown size={14} className={isStoreDropdownOpen ? "rotate-180" : ""} />
              </button>
              {isStoreDropdownOpen && (
                <div className="ml-8 mt-2 space-y-2 border-l-2 border-slate-100 pl-4">
                  {['WH-1', 'WH-2', 'WH-3', 'WH-4'].map(wh => (
                    <button key={wh} onClick={() => {
  setSelectedView(wh);
  fetchMarketAudit(wh);
}} className={`block text-[11px] font-bold uppercase transition-colors ${selectedView === wh ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900'}`}>Warehouse 0{wh.split('-')[1]}</button>
                  ))}
                </div>
              )}
            </div>
            <NavItem icon={<FileText size={20}/>} label="Generate Report" onClick={() => setIsReportModalOpen(true)} />
            <NavItem icon={<MessageSquare size={20}/>} label="Admin Chat" onClick={() => navigate('/admin-chat')} />
          </nav>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <TopNavbar setSidebarOpen={setSidebarOpen} isSidebarOpen={isSidebarOpen} />
        <main className="p-8 lg:p-12 overflow-y-auto">
          {selectedView === 'overview' ? renderOverview() : renderWarehouseSubView(selectedView)}
        </main>
      </div>

      {/* DUAL-MODE ANOMALY MODAL */}
      {isAnomalyModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setIsAnomalyModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl">
             <h3 className="text-2xl font-black italic uppercase text-slate-800 mb-8 border-b pb-4">
               {selectedView === 'overview' ? 'Global Anomalies' : `${selectedView} Category Anomalies`}
             </h3>
             <div className="space-y-4">
                {selectedView === 'overview' ? (
                  // Global Overview Breakdown (image_d63332.jpg)
                  <>
                    <AnomalyRow store="Warehouse 01" count="04" color="rose" />
                    <AnomalyRow store="Warehouse 02" count="02" color="amber" />
                    <AnomalyRow store="Warehouse 03" count="06" color="rose" />
                    <AnomalyRow store="Warehouse 04" count="01" color="emerald" />
                  </>
                ) : (
                  // Specific Warehouse Category Breakdown (image_d5d57e.jpg)
                  strategicData.categoryAnomalies.map((a, idx) => (
                    <AnomalyRow key={idx} store={a.label} count={a.count} color={a.color} />
                  ))
                )}
             </div>
          </div>
        </div>
      )}

      {isReportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setIsReportModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl text-center">
             <FileText size={48} className="mx-auto text-indigo-600 mb-6" />
             <h3 className="text-xl font-black uppercase text-slate-800 mb-4">{selectedView === 'overview' ? 'Global Strategy Hub' : `Terminal Report: ${selectedView}`}</h3>
             <button onClick={handleReportAction} className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black uppercase text-xs shadow-xl transition-all">Download Report</button>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon, color, onClick, clickable, breakdown }) => (
  <div
    onClick={onClick}
    className={`bg-white/90 p-8 rounded-[2.5rem] border border-slate-100 flex items-start gap-6 shadow-sm transition-all w-full ${
      clickable ? 'cursor-pointer hover:shadow-indigo-100 hover:translate-y-[-5px]' : ''
    }`}
  >
    {/* ICON */}
    <div className={`p-5 bg-${color}-50 text-${color}-600 rounded-3xl flex-shrink-0`}>
      {icon}
    </div>

    {/* TEXT CONTENT */}
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
        {label}
      </p>

      {/* VALUE (FIXED ALIGNMENT) */}
      <p className="text-3xl font-black text-slate-800 italic break-words leading-tight">
        {value}
      </p>

      {/* BREAKDOWN */}
      {breakdown && (
        <div className="text-[10px] text-slate-500 mt-2 space-y-1 break-words">
          {Object.entries(breakdown).map(([wh, val]) => (
            <div key={wh} className="flex justify-between gap-2">
              <span>{wh}</span>
              <span className="font-bold text-slate-700">{val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
const NavItem = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-4 px-6 py-4 rounded-2xl cursor-pointer transition-all ${active ? 'bg-indigo-600 text-white shadow-indigo-100 shadow-xl' : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-600'}`}>
    {icon} <span className="text-[11px] font-bold uppercase tracking-[0.15em]">{label}</span>
  </div>
);

const AnomalyRow = ({ store, count, color }) => (
    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
        <p className="font-bold text-slate-700 uppercase">{store}</p>
        <span className={`px-4 py-1.5 rounded-full bg-${color}-100 text-${color}-600 text-xs font-black`}>{count} Anomalies</span>
    </div>
);

export default AdminDashboard;