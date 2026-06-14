import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

import { useNavigate } from 'react-router-dom';
import bgImage from "../../images/bg.jpg";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { 
  LayoutDashboard, Store, FileText, MessageSquare, 
  Package, DollarSign, AlertTriangle, Activity, Database,
  ChevronDown, Menu, TrendingUp, BrainCircuit, Boxes, X
} from 'lucide-react';

import TopNavbar from '../../components/common/TopNavbar';

const AdminDashboard = () => {
  
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedView, setSelectedView] = useState('overview'); 
  const [isStoreDropdownOpen, setIsStoreOpen] = useState(false);
  const [isAnomalyModalOpen, setIsAnomalyModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false); 
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

  const COLORS = ['#4b7291', '#70d6bc', '#ffd08a', '#ff8a8a'];
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
    let generatedReport = "";

try {
  const reportRes = await axios.get(
    "http://localhost:3002/api/audit-report"
  );

  generatedReport = reportRes.data?.report || "";
} catch (err) {
  console.error("Error fetching generated report:", err);
}

    const fetchAllAudit = async (store) => {
        try {
            const results = await Promise.all(
                categories.map(async (cat) => {
                    const res = await axios.get(`http://localhost:3002/api/audit-summary?store=${store}&category=${cat}`);
                    return { category: cat, data: res.data || {} };
                })
            );
            return results;
        } catch (err) {
            console.error("Audit fetch error:", err);
            return [];
        }
    };

    doc.setFillColor(43, 58, 74); 
    doc.rect(0, 0, 210, 45, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("SMARTSTOCK INTELLIGENCE REPORT", 15, 25);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`REPORT TYPE: ${isGlobal ? "GLOBAL STRATEGIC OVERVIEW" : `TERMINAL AUDIT [${selectedView}]`}`, 15, 35);
    doc.text(`GENERATED: ${timestamp}`, 140, 35);

    let y = 60;
    doc.setTextColor(43, 58, 74);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("01. Executive KPI Summary", 15, y);
    doc.setDrawColor(209, 226, 232);
    doc.line(15, y + 2, 195, y + 2);

    y += 15;
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text("METRIC", 20, y);
    doc.text("VALUE", 100, y);

    y += 8;
    doc.setTextColor(0, 0, 0);
    const totalRevLabel = isGlobal ? "Total Network Revenue" : "Total Revenue";
    const totalStockLabel = isGlobal ? "Total Network Stock" : "Total Stock Balance";
    const revValue = isGlobal ? revenue : (warehouseRevenue[selectedView] || 0);
    const stockValue = isGlobal ? stockData.total : (stockData.breakdown[selectedView] || 0);

    const drawRow = (label, val, currentY) => {
        doc.setFillColor(248, 250, 252);
        doc.rect(15, currentY - 5, 180, 8, 'F');
        doc.setFont("helvetica", "normal");
        doc.text(label, 20, currentY);
        doc.setFont("helvetica", "bold");
        doc.text(val, 100, currentY);
    };

    drawRow(totalRevLabel, `$${Number(revValue).toLocaleString()}`, y);
    y += 10;
    drawRow(totalStockLabel, `${Number(stockValue).toLocaleString()} Units`, y);

    y += 20;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(43, 58, 74);
    doc.text(isGlobal ? "02. Regional Revenue Performance" : "02. Category-Wise Stock Balance", 15, y);
    doc.line(15, y + 2, 195, y + 2);

    y += 12;
    doc.setFontSize(10);
    const breakdownData = isGlobal ? Object.entries(warehouseRevenue) : getWarehouseStockData(selectedView).map(i => [i.category, i.stock]);
    breakdownData.forEach(([label, val], index) => {
        if (index % 2 === 0) { doc.setFillColor(241, 245, 249); doc.rect(15, y - 5, 180, 8, 'F'); }
        doc.setFont("helvetica", "normal");
        doc.text(`${label}`, 20, y);
        doc.text(isGlobal ? `$${Number(val).toLocaleString()}` : `${Number(val).toLocaleString()} Units`, 100, y);
        y += 8;
    });

    if (y > 220) { doc.addPage(); y = 20; } else { y += 15; }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("03. Forensic Anomalies & Data Integrity", 15, y);
    doc.line(15, y + 2, 195, y + 2);

    y += 15;
    const auditData = await fetchAllAudit(isGlobal ? "GLOBAL" : selectedView);
    doc.setFillColor(75, 114, 145);
    doc.rect(15, y - 7, 180, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text("CATEGORY", 20, y);
    doc.text("FIN. LOSS", 60, y);
    doc.text("DATA GAPS", 95, y);
    doc.text("DEAD STOCK", 130, y);
    doc.text("MARKET GAPS", 165, y);

    y += 10;
    doc.setTextColor(0, 0, 0);
    auditData.forEach((item) => {
        doc.setDrawColor(226, 232, 240);
        doc.line(15, y + 2, 195, y + 2);
        doc.setFont("helvetica", "bold");
        doc.text(item.category, 20, y);
        doc.setFont("helvetica", "normal");
        doc.text(`${item.data.financial_loss || 0}`, 60, y);
        doc.text(`${item.data.data_gaps || 0}`, 95, y);
        doc.text(`${item.data.dead_stock || 0}`, 130, y);
        doc.text(`${item.data.market_gaps || 0}`, 165, y);
        y += 10;
    });
    if (generatedReport) {
  if (y > 220) {
    doc.addPage();
    y = 20;
  }

  y += 15;

  doc.setFontSize(14);
  doc.setTextColor(43, 58, 74);
  doc.setFont("helvetica", "bold");
  doc.text("04. AI Generated Action Plan", 15, y);

  doc.line(15, y + 2, 195, y + 2);

  y += 12;

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");

  const reportLines = doc.splitTextToSize(
    generatedReport.replace(/\*\*/g, ""),
    180
  );

  doc.text(reportLines, 15, y);
}

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("Internal Document - SmartStock AI Terminal - Unauthorized duplication prohibited", 105, 285, { align: "center" });
    doc.save(`${selectedView}_Professional_Report.pdf`);
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
    const res = await axios.get(`http://localhost:3002/market-audit/market-audit/${warehouseId}`);
    setMarketAuditData(res.data || []);
  } catch (err) {
    console.error("Market audit error:", err);
  }
};

const fetchAuditSummary = async (store, category, index) => {
  try {
    setLoadingRow(index); 
    const res = await axios.get(`http://localhost:3002/api/audit-summary?store=${store}&category=${category}`);
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
    setStrategicData(prev => ({ ...prev, marketBenchmarking: updated }));
  } catch (err) {
    console.error("Audit API error:", err);
  } finally {
    setLoadingRow(null); 
  }
};

const renderWarehouseSubView = (id) => (
  <div className="space-y-6 animate-in slide-in-from-right duration-500">
    <div className="flex items-center justify-between">
       <h2 className="text-2xl font-black uppercase italic text-slate-800 tracking-tighter">Strategic Analysis: {id}</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatCard label="Calculated Revenue" value={warehouseRevenue[id] != null ? `$${Number(warehouseRevenue[id]).toLocaleString()}` : "Loading..."} icon={<DollarSign/>} color="blue" />
      <StatCard label="Total Stocks" value={stockData.breakdown[id]} icon={<Package/>} color="teal" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="ims-card p-6 shadow-xl bg-white/60 backdrop-blur-md rounded-[2rem] border border-white/40">
        <h3 className="text-[11px] font-black uppercase text-slate-500 mb-6 flex items-center gap-2 tracking-widest"><Boxes size={14}/> Stock Volume per Category</h3>
        <div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={getWarehouseStockData(id)}  innerRadius={60} outerRadius={85}
    paddingAngle={5}
    dataKey="stock"
    nameKey="category"
  >
    {getWarehouseStockData(id).map((entry, index) => (
      <Cell key={index} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip />
 <Legend />
</PieChart></ResponsiveContainer></div>
      </div>
      <div className="ims-card p-6 shadow-xl bg-white/60 backdrop-blur-md rounded-[2rem] border border-white/40">
        <h3 className="text-[11px] font-black uppercase text-slate-500 mb-6 flex items-center gap-2 tracking-widest"><BrainCircuit size={14} className="text-[#4b7291]"/> Market Intelligence Audit</h3>
        <div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={marketAuditData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" /><XAxis dataKey="category" fontSize={10} fontWeight="900" /><YAxis fontSize={10} fontWeight="700" /><Tooltip cursor={{fill: '#f8fafc'}} /><Legend /><Bar
  name="Avg Competitor Price"
  dataKey="competitor_price"
  fill="#94a3b8" 
  radius={[4, 4, 0, 0]}
/>
<Bar
  name="Avg Price"
  dataKey="unit_price"
  fill="#4b7291" 
  radius={[4, 4, 0, 0]}
/></BarChart></ResponsiveContainer></div>
      </div>
    </div>
    <div className="ims-card p-6 shadow-xl bg-white/70 backdrop-blur-md rounded-[2rem] border border-white/40">
      <h3 className="text-[11px] font-black uppercase text-slate-500 mb-4 tracking-widest">Category-wise Stock</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {getWarehouseStockData(id).map((item, i) => (
          <div key={i} className="p-6 bg-white/80 rounded-[1.5rem] border border-white/50 text-center shadow-sm hover:shadow-md transition-all">
            <p className="text-[10px] font-black text-[#4b7291] uppercase mb-1 tracking-wider">{item.category}</p>
            <p className="text-2xl font-black text-slate-800 tracking-tighter">{item.stock.toLocaleString()}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Total Units</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const renderOverview = () => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatCard 
        label="Total Stock" 
        value={stockData.total} 
        icon={<Package/>} 
        color="blue" 
        clickable={true}
        onClick={() => setIsStockModalOpen(true)} 
      />
      <StatCard label="Total Revenue" value={`$${revenue.toLocaleString()}`} icon={<DollarSign/>} color="teal" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white/70 backdrop-blur-md p-8 rounded-[2rem] shadow-lg border border-white/40">
        <h3 className="text-[11px] font-black uppercase text-slate-500 mb-6 flex items-center gap-2 tracking-widest"><Store size={14} /> Global Store Distribution</h3>
        <div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={globalDistribution} innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value">
  {globalDistribution.map((entry, index) => (
    <Cell key={index} fill={COLORS[index % COLORS.length]} />
  ))}
</Pie><Tooltip /><Legend layout="vertical" align="right" verticalAlign="middle" /></PieChart></ResponsiveContainer></div>
      </div>
      <div className="bg-white/70 backdrop-blur-md p-8 rounded-[2rem] shadow-lg border border-white/40">
        <h3 className="text-[11px] font-black uppercase text-slate-500 mb-6 flex items-center gap-2 tracking-widest"><Boxes size={14} /> Space Utilization AI</h3>
        <div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><RadarChart cx="50%" cy="50%" outerRadius="80%" data={utilizationData}>
  <PolarGrid stroke="#cbd5e1" strokeWidth={1}/>
  <PolarAngleAxis dataKey="warehouse" fontSize={11} fontWeight="900" stroke="#475569"/>
  <Radar
  name="Utilization %"
  dataKey="utilization"
  stroke="#4b7291"
  strokeWidth={2}
  fill="#4b7291"
  fillOpacity={0.4}
/>
  <Tooltip 
    formatter={(value, name, props) => [
      `Status: ${props.payload.status} : ${value}%`,
      props.payload.warehouse
    ]}
  />
</RadarChart></ResponsiveContainer></div>
      </div>
    </div>
    <section className="bg-white/60 backdrop-blur-lg p-8 rounded-[2rem] shadow-xl border border-white/50">
      <div className="flex justify-between items-center mb-8">
          <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-600 flex items-center gap-2 italic">
            <AlertTriangle size={16} className="text-rose-500" /> Anomalies Analysis
          </h3>
      </div>
      <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-3">
              <thead><tr className="text-[10px] font-black uppercase text-slate-500 tracking-widest"><th className="px-6 py-3">Warehouse</th><th className="px-6 py-3">Category</th><th className="px-6 py-3 text-center">financial loss</th><th className="px-6 py-3 text-center">data gaps</th><th className="px-6 py-3 text-center">dead stock</th><th className="px-6 py-3 text-right">market gaps</th></tr></thead>
              <tbody className="text-[12px] font-black text-slate-800">
                {strategicData.marketBenchmarking.map((row, i) => (
                  <tr key={i} className="group transition-all">
                    <td className="px-6 py-5 rounded-l-2xl bg-white/90 border-y border-l border-white shadow-sm">{row.id}</td>
                    <td className="px-6 py-5 bg-white/90 border-y border-white shadow-sm">
                      <select
                      disabled={loadingRow === i} 
                      className={`bg-slate-100/50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-black focus:outline-none focus:border-[#4b7291] transition-all cursor-pointer ${loadingRow === i ? 'opacity-50 cursor-not-allowed' : ''}`}
                      value={row.category || ''}
                      onChange={(e) => fetchAuditSummary(row.id, e.target.value, i)}
                      >
                          <option value="">Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                      </select>
                    </td>
                    <td className="px-6 py-5 bg-white/90 border-y border-white shadow-sm text-center text-rose-600">{row.financial_loss}</td>
                    <td className="px-6 py-5 bg-white/90 border-y border-white shadow-sm text-center text-amber-600">{row.data_gaps}</td>
                    <td className="px-6 py-5 bg-white/90 border-y border-white shadow-sm text-center text-indigo-600">{row.dead_stock}</td>
                    <td className="px-6 py-5 rounded-r-2xl bg-white/90 border-y border-r border-white shadow-sm text-right text-[#4b7291]">{row.market_gaps}</td>
                  </tr>
                ))}
              </tbody>
          </table>
      </div>
    </section>
  </div>
); 

  return (
    <div 
      className="flex min-h-screen font-sans relative overflow-hidden bg-[#e2eff5]"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/5 backdrop-blur-[3px] z-0"></div>

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#2b3a4a]/95 backdrop-blur-xl border-r border-white/10 transition-all ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-[#4b7291] rounded-xl shadow-lg text-white"><Database size={20} /></div>
            <h1 className="text-lg font-black tracking-tighter text-white uppercase italic">Admin Terminal</h1>
          </div>
          <nav className="space-y-1 flex-1">
            <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" active={selectedView === 'overview'} onClick={() => setSelectedView('overview')} />
            <div className="relative">
              <button onClick={() => setIsStoreOpen(!isStoreDropdownOpen)} className="w-full flex items-center justify-between p-4 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all font-black uppercase text-[10px] tracking-widest">
                 <div className="flex items-center gap-3"><Store size={18}/> <span>Inventory</span></div>
                 <ChevronDown size={12} className={`transition-transform duration-300 ${isStoreDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {isStoreDropdownOpen && (
                <div className="ml-8 mt-1 space-y-1 border-l-2 border-[#4b7291]/30 pl-4 animate-in slide-in-from-top-2">
                  {['WH-1', 'WH-2', 'WH-3', 'WH-4'].map(wh => (
                    <button key={wh} onClick={() => { setSelectedView(wh); fetchMarketAudit(wh); }} className={`block text-[10px] font-black uppercase text-left w-full p-2 transition-all ${selectedView === wh ? 'text-[#70d6bc]' : 'text-slate-400 hover:text-white'}`}>Warehouse 0{wh.split('-')[1]}</button>
                  ))}
                </div>
              )}
            </div>
            <NavItem icon={<FileText size={18}/>} label="Full Analytics" onClick={() => setIsReportModalOpen(true)} />
            {/* <NavItem icon={<MessageSquare size={18}/>} label="Strategic Hub" onClick={() => navigate('/admin-chat')} /> */}
          </nav>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <TopNavbar setSidebarOpen={setSidebarOpen} isSidebarOpen={isSidebarOpen} role="admin" />
        <main className="p-6 lg:p-10 overflow-y-auto">
          {selectedView === 'overview' ? renderOverview() : renderWarehouseSubView(selectedView)}
        </main>
      </div>

      {isStockModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setIsStockModalOpen(false)}></div>
          <div className="relative bg-white/95 w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl overflow-hidden border border-white">
             <button onClick={() => setIsStockModalOpen(false)} className="absolute top-8 right-8 p-3 bg-slate-50 rounded-xl hover:bg-rose-50 hover:text-rose-50 transition-all text-slate-400">
               <X size={20} />
             </button>
             <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-[#4b7291] text-white rounded-2xl shadow-lg"><Package size={22}/></div>
                <h3 className="text-2xl font-black italic uppercase text-slate-800 tracking-tighter">Global Inventory</h3>
             </div>
             <div className="space-y-6">
                {Object.entries(stockData.breakdown).map(([wh, val]) => (
                  <div key={wh} className="group">
                    <div className="flex justify-between items-end mb-2">
                       <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Warehouse 0{wh.split('-')[1]}</p>
                       <p className="text-xl font-black text-[#4b7291] italic">{val.toLocaleString()} Units</p>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                       <div className="h-full bg-gradient-to-r from-[#4b7291] to-[#70d6bc] rounded-full transition-all duration-1000 ease-out" style={{ width: `${(val / stockData.total) * 100}%` }} />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

      {isReportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setIsReportModalOpen(false)}></div>
          <div className="relative bg-white/95 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl text-center border border-white">
             <div className="w-20 h-24 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
               <FileText size={40} className="text-[#4b7291]" />
             </div>
             <h3 className="text-xl font-black italic uppercase text-slate-800 mb-4 tracking-tighter">{selectedView === 'overview' ? 'Strategic Intelligence Hub' : `Terminal Report: ${selectedView}`}</h3>
             <p className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.3em] mb-8">Generative BI Export</p>
             <button onClick={handleReportAction} className="w-full bg-[#4b7291] hover:bg-[#3a5a70] text-white py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl transition-all active:scale-95">Download PDF Analytics</button>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon, color, onClick, clickable }) => (
  <div
    onClick={onClick}
    className={`bg-white/80 backdrop-blur-lg p-8 rounded-[2rem] border border-white/60 flex items-start gap-6 shadow-lg transition-all duration-300 w-full ${clickable ? 'cursor-pointer hover:shadow-xl group' : ''}`}
  >
    <div className={`p-5 bg-slate-50 text-[#4b7291] rounded-2xl flex-shrink-0 shadow-inner group-hover:bg-[#4b7291] group-hover:text-white transition-all`}>
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black text-slate-900 italic break-words leading-none tracking-tighter">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {clickable && <p className="text-[9px] font-black text-[#4b7291] mt-3 uppercase tracking-wider animate-pulse italic">click to see the breakdown →</p>}
    </div>
  </div>
);

const NavItem = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-3 px-5 py-4 rounded-xl cursor-pointer transition-all duration-300 ${active ? 'bg-[#4b7291] text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
    {icon} <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
  </div>
);

const AnomalyRow = ({ store, count, color }) => (
    <div className="flex items-center justify-between p-6 bg-white/50 rounded-2xl border border-white shadow-sm transition-all">
        <p className="font-black text-slate-800 uppercase tracking-widest text-[11px]">{store}</p>
        <span className={`px-4 py-1.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-black shadow-sm italic`}>{count} Anomalies Detected</span>
    </div>
);

export default AdminDashboard;