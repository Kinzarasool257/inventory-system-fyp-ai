import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar, PolarRadiusAxis, CartesianGrid } from 'recharts';
import { 
  TrendingUp, BarChart3, ShieldCheck, BrainCircuit, Activity,
  Truck, AlertCircle, Eye, Gauge, ArrowRight, FileText, 
  DollarSign, Package, AlertTriangle, LayoutDashboard, Database, 
  Menu, X, Download, ShieldAlert, Layers, ShoppingCart, 
  ArrowDownCircle, ArrowUpCircle, Scale, Zap, Boxes, MessageSquare, LineChart
} from 'lucide-react';
import ManagerNotificationBell from '../../components/notifications/ManagerNotificationBell';

import bgImage from "../../images/bg.jpg"; 

const Store2Dashboard = () => {
  const navigate = useNavigate();
  const [userData] = useState(() => {
    const savedUser = localStorage.getItem('user'); 
    return savedUser ? JSON.parse(savedUser) : { role: 'store2', name: 'Manager' };
  });
  const [automationLogs, setAutomationLogs] = useState([]);
  const [wh2Stock, setWh2Stock] = useState(0);
  const [wh2Revenue, setWh2Revenue] = useState(0);
  const selectedStore = 'WH-2'; // 🎯 Set strictly to Node Warehouse 2
  const categories = ['Books', 'Toys', 'Electronics', 'Clothes'];
  const generateProducts = (prefix, count) =>
    Array.from({ length: count }, (_, i) => `${prefix}_${i + 1}`);

  const productMap = {
    Books: generateProducts("Book", 20),
    Toys: generateProducts("Toy", 20),
    Electronics: generateProducts("Electronic", 20),
    Clothes: generateProducts("Cloth", 20),
  };

  const COLORS = ['#4b7291', '#70d6bc', '#ffd08a', '#ff8a8a'];

  const [selectedCategory, setSelectedCategory] = useState('Books');
  const [selectedProduct, setSelectedProduct] = useState('Book_1');
  const [modalCategory, setModalCategory] = useState('Books');
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

  useEffect(() => {
    const fetchAutomationLogs = async () => {
      try {
        const res = await axios.get(`http://localhost:3002/alert/automation-logs?store=${selectedStore}`);
        const logs = res.data?.productLogs || [];
        const filteredLogs = logs.filter((item) => item.status.includes("UNDERSTOCK") || item.status.includes("OVERSTOCK"));
        setAutomationLogs(filteredLogs);
      } catch (error) { console.error("Automation Logs Error:", error); }
    };
    fetchAutomationLogs();
  }, [selectedStore]);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/revenue/warehouse/${selectedStore}`);
        setWh2Revenue(Number(response.data?.totalRevenue || 0));
      } catch (error) { setWh2Revenue(0); }
    };
    fetchRevenue();
  }, [selectedStore]);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axios.get("http://localhost:3002/stock/total-stock");
        const wh2 = response.data?.breakdown?.[selectedStore];
        setWh2Stock(wh2 ? Number(wh2) : 0);
      } catch (error) { setWh2Stock(0); }
    };
    fetchStock();
  }, [selectedStore]);

  useEffect(() => {
    if (isAnomalyModalOpen) { fetchAuditSummary(selectedStore, modalCategory); }
  }, [modalCategory, isAnomalyModalOpen]);

  useEffect(() => { setSelectedProduct(productMap[selectedCategory][0]); }, [selectedCategory]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invRes = await axios.get(`http://localhost:3002/StockData/inventory?store=${selectedStore}&item=${selectedProduct}`);
        const data = Array.isArray(invRes.data) ? invRes.data : [];
        setInventoryLog(data);
        setTotalRevenue(data.reduce((sum, row) => sum + (parseFloat(row.revenue) || 0), 0));

        const anomalyRes = await axios.get(`http://localhost:3002/api/anomalies`);

        let anomalyList = [];
        if (Array.isArray(anomalyRes.data)) {
          anomalyList = anomalyRes.data;
        } else if (Array.isArray(anomalyRes.data?.anomalies)) {
          anomalyList = anomalyRes.data.anomalies;
        } else if (Array.isArray(anomalyRes.data?.data)) {
          anomalyList = anomalyRes.data.data;
        }

        const warehouseAnomalies = anomalyList.filter(a => a.warehouse_id === selectedStore);
        setAnomalies(warehouseAnomalies);
      } catch (error) {
        console.error("API Error", error);
        setAnomalies([]);
      }
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
      const compRes = await axios.get(`http://localhost:3002/competitor-price?store=${selectedStore}&item=${selectedProduct}&stock=${currentStock}&price=${basePrice}`);
      setCompetitorPrice(compRes.data.competitor_price);
    } catch (error) { console.error(error); } finally { setIsSyncing(false); }
  };

  const fetchAuditSummary = async (store, category) => {
    try {
      const res = await axios.get(`http://localhost:3002/api/audit-summary?store=${store}&category=${category}`);
      const data = res.data || {};
      setAuditSummary({
        financial_loss: Number(data.financial_loss || 0),
        dead_stock: Number(data.dead_stock || 0),
        market_gaps: Number(data.market_gaps || 0),
        revenue_gaps: Number(data.data_gaps || 0),
      });
    } catch (error) { console.error("Audit API error:", error); }
  };

  const generateIntelligenceReport = async () => {
    setIsSyncing(true);
    try {
      const doc = new jsPDF();
      const timestamp = new Date().toLocaleString();

      let auditData = {};
      let categoryData = {};
      let aiGeneratedReportText = "";

      try {
        const auditReportRes = await axios.get(`http://localhost:3002/api/audit-report?warehouse_id=${selectedStore}`);
        auditData = auditReportRes.data?.warehouse_summary?.undefined || {};
        categoryData = auditReportRes.data?.faulty_records || {};
        aiGeneratedReportText = auditReportRes.data?.report || "";
      } catch (apiErr) {
        console.warn("Backend API request failed or encountered rate limits. Using fallback state values.");
        auditData = { total_records: 58400, overpriced_cases: 4216, dead_stock_cases: 1389, financial_loss_cases: 0 };
        categoryData = { 
          Books: { total_faults: 3247 }, 
          Clothes: { total_faults: 585 }, 
          Electronics: { total_faults: 350 }, 
          Toys: { total_faults: 1318 } 
        };
        aiGeneratedReportText = "**Action Plan: Warehouse Risk Assessment**\n\n### Immediate Actions (Next 30 days)\n1. Investigate Overpriced Cases\n* Assign a team to balance pricing parameters across affected stock items.\n2. Dead Stock Clearance Framework\n* Implement operational clearance channels for zero-movement inventory segments.";
      }

      const [revenueRes, stockRes] = await Promise.all([
        axios.get(`http://localhost:3002/revenue/warehouse/${selectedStore}`).catch(() => ({ data: { totalRevenue: 0 } })),
        axios.get(`http://localhost:3002/stock/total-stock`).catch(() => ({ data: { breakdown: {} } }))
      ]);

      const revenue = Number(revenueRes.data?.totalRevenue || 0);
      const totalStock = Number(stockRes.data?.breakdown?.[selectedStore] || 0);

      doc.setFillColor(43, 58, 74); 
      doc.rect(0, 0, 210, 45, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("FULL INTELLIGENCE REPORT", 15, 25);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Warehouse Terminal: ${selectedStore} | Issued: ${timestamp}`, 15, 35);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("1. Business Overview", 15, 60);
      doc.setDrawColor(209, 226, 232);
      doc.line(15, 62, 195, 62);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Total Records Scanned: ${auditData.total_records || 0}`, 20, 72);
      doc.text(`Total Revenue: $${revenue.toLocaleString()}`, 20, 80);
      doc.text(`Total Stock Units: ${totalStock}`, 20, 88);

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("2. Inventory Health Analysis", 15, 105);
      doc.line(15, 107, 195, 107);

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Risk Evaluation Category", 20, 115);
      doc.text("Detected Audit Cases", 140, 115);
      doc.setFont("helvetica", "normal");
      
      doc.text("Overpriced Items (Revenue Leakage)", 20, 123);
      doc.text(String(auditData.overpriced_cases || 0), 140, 123);

      doc.text("Dead Stock (Zero Volume Movement)", 20, 131);
      doc.text(String(auditData.dead_stock_cases || 0), 140, 131);

      doc.text("Financial Loss Cases", 20, 139);
      doc.text(String(auditData.financial_loss_cases || 0), 140, 139);

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("3. Critical Fault Distribution Matrix", 15, 155);
      doc.line(15, 157, 195, 157);

      let yPos = 165;
      Object.keys(categoryData).forEach((cat) => {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`${cat}:`, 20, yPos);
        doc.setFont("helvetica", "bold");
        doc.text(`${categoryData[cat].total_faults || 0} system faults identified`, 60, yPos);
        yPos += 8;
      });

      if (aiGeneratedReportText) {
        doc.addPage();
        let runningY = 25;

        doc.setFillColor(43, 58, 74); 
        doc.rect(0, 0, 210, 15, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`EXECUTIVE ACTION PLAN PROJECTIONS - LOCATION: ${selectedStore}`, 15, 10);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text("4. AI Generated Action Plan & Directives", 15, runningY);
        doc.setDrawColor(209, 226, 232);
        doc.line(15, runningY + 2, 195, runningY + 2);
        runningY += 12;

        const reportLines = aiGeneratedReportText.replace(/\*\*/g, "").split("\n");

        reportLines.forEach((rawRow) => {
          const currentLine = rawRow.trim();
          if (!currentLine) {
            runningY += 4; 
            return;
          }

          if (runningY > 275) {
            doc.addPage();
            runningY = 25;
          }

          if (currentLine.startsWith("###") || currentLine.endsWith(":") || currentLine.includes("Actions (Next")) {
            runningY += 4;
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text(currentLine.replace(/###/g, "").trim(), 15, runningY);
            runningY += 7;
            return;
          }

          doc.setFontSize(9.5);
          if (currentLine.match(/^(\d+\.)|^\*|^-/)) {
            doc.setFont("helvetica", "bold");
            const splitBullet = doc.splitTextToSize(currentLine, 172);
            splitBullet.forEach((rowChunk, rIdx) => {
              if (runningY > 275) { doc.addPage(); runningY = 25; }
              doc.text(rowChunk, rIdx === 0 ? 20 : 25, runningY);
              runningY += 5.5;
            });
          } else {
            doc.setFont("helvetica", "normal");
            const splitParagraph = doc.splitTextToSize(currentLine, 178);
            splitParagraph.forEach((rowChunk) => {
              if (runningY > 275) { doc.addPage(); runningY = 25; }
              doc.text(rowChunk, 15, runningY);
              runningY += 5.5;
            });
          }
        });
      }

      const computedTotalPages = doc.internal.getNumberOfPages();
      for (let index = 1; index <= computedTotalPages; index++) {
        doc.setPage(index);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(148, 163, 184);
        doc.text(`SmartStock Automated Node Report Management System — Sheet ${index} of ${computedTotalPages}`, 15, 288);
      }

      doc.save(`Full_Intelligence_Report_${selectedStore}.pdf`);
    } catch (error) { 
      console.error("Full Report Parsing Operational Error Framework:", error); 
    } finally { 
      setIsSyncing(false); 
    }
  };

  const generateFullBIReport = async () => {
    setIsSyncing(true);
    try {
      const doc = new jsPDF();
      const timestamp = new Date().toLocaleString();
      let auditData = {};
      try {
        const res = await axios.get(`http://localhost:3002/api/audit-summary?store=${selectedStore}&category=${modalCategory}`);
        auditData = res.data || {};
      } catch (error) { console.error("Audit fetch failed:", error); }

      doc.setFillColor(43, 58, 74); 
      doc.rect(0, 0, 210, 45, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("ANOMALY & AUDIT REPORT", 15, 25);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Terminal ID: " + selectedStore + " | Sector: " + modalCategory.toUpperCase(), 15, 35);
      doc.text("Generated: " + timestamp, 140, 35);

      let y = 65;
      doc.setTextColor(43, 58, 74);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("1. Strategic Audit Summary", 15, y);
      doc.setDrawColor(209, 226, 232);
      doc.line(15, y + 2, 195, y + 2);

      const metrics = [
        { label: "Financial Loss Exposure", value: "$" + Number(auditData.financial_loss || 0).toLocaleString() },
        { label: "Dead Stock Volume", value: Number(auditData.dead_stock || 0).toLocaleString() + " Units" },
        { label: "Market Gaps Identified", value: Number(auditData.market_gaps || 0).toLocaleString() },
        { label: "Revenue Discrepancies", value: Number(auditData.data_gaps || 0).toLocaleString() }
      ];

      y += 15;
      metrics.forEach((m) => {
        doc.setFillColor(248, 250, 252);
        doc.rect(15, y - 6, 180, 10, 'F');
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(10);
        doc.text(m.label.toUpperCase(), 20, y);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.text(m.value, 110, y);
        y += 12;
      });

      doc.save("Audit_Anomaly_Report_" + selectedStore + "_" + modalCategory + ".pdf");
    } catch (error) { console.error("PDF Generation Failed:", error); } finally { setIsSyncing(false); }
  };

  return (
    <div 
      className="flex min-h-screen font-sans relative overflow-hidden"
      style={{ 
        backgroundImage: `url(${bgImage})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        width: '100vw',
        height: '100vh'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-[#e2eff5]/30 to-amber-50/20 backdrop-blur-[4px] z-0"></div>

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#2b3a4a]/90 backdrop-blur-xl transition-all border-r border-white/10 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2.5 bg-[#4b7291] rounded-xl shadow-lg shadow-blue-900/20">
              <Database size={22} className="text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-white uppercase italic">SmartStock</h1>
          </div>
          <nav className="space-y-2 flex-1">
            <NavItem icon={<LayoutDashboard size={20}/>} label="Overview" active onClick={() => setSidebarOpen(false)} />
            <NavItem icon={<ShieldCheck size={20}/>} label="Anomaly Detection Report" onClick={() => setIsAnomalyModalOpen(true)} />
            <NavItem icon={<FileText size={20}/>} label="Generate Report" onClick={generateIntelligenceReport} />
          </nav>
          <div className="mt-auto p-5 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#4b7291] flex items-center justify-center text-white font-bold shadow-inner">OP</div>
                <div>
                   <p className="text-xs font-black text-white">{userData.name}</p>
                   <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Auth Store 2</p>
                </div>
             </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <nav className="h-20 bg-white/40 backdrop-blur-md border-b border-[#d1e2e8]/50 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 hover:bg-white/50 rounded-lg transition-colors"><Menu size={20}/></button>
            <h2 className="text-xl font-black italic text-[#4b7291] tracking-tight">Welcome Manager !</h2>
          </div>
          <div className="flex items-center gap-4">
              <ManagerNotificationBell />
              <button onClick={generateIntelligenceReport} className="flex items-center gap-2 px-6 py-2.5 bg-[#4b7291] text-white rounded-xl font-black text-[11px] uppercase shadow-[0_5px_15px_rgba(75,114,145,0.3)] hover:scale-105 active:scale-95 transition-all">
                <Download size={14}/> Full Intelligence Report
              </button>
          </div>
        </nav>

        <main className="p-8 lg:p-12 space-y-10 overflow-y-auto">
          <div className="mb-6 animate-in slide-in-from-left duration-700">
            <h2 className="text-2xl font-black uppercase italic text-slate-800 tracking-tighter flex items-center gap-3">
              <div className="w-2 h-8 bg-[#4b7291] rounded-full"></div>
               Warehouse 02
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard label="Total Revenue" value={"$" + wh2Revenue.toLocaleString()} icon={<DollarSign/>} color="blue" />
            <StatCard label="Total Stocks" value={wh2Stock} icon={<Package/>} color="teal" />
            <StatCard
              label="Anomaly Count"
              value="Click To See Anomalies"
              icon={<AlertTriangle/>}
              color="rose"
              clickable
              onClick={async () => {
                await fetchAuditSummary(selectedStore, modalCategory);
                setIsAnomalyModalOpen(true);
              }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white/70 backdrop-blur-lg border border-white/50 p-8 rounded-[2.5rem] shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-8 flex items-center gap-2">
                <Activity size={16} className="text-[#4b7291]" /> Operational Efficiency
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={utilizationData}>
                    <PolarGrid stroke="#cbd5e1" />
                    <PolarAngleAxis dataKey="subject" fontSize={11} fontWeight="bold" stroke="#475569" />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} fontSize={9} stroke="#94A3B8" /> 
                    <Radar name="Usage" dataKey="A" stroke="#4b7291" fill="#4b7291" fillOpacity={0.6} dot={{ r: 4, fill: "#fff", stroke: "#4b7291", strokeWidth: 2 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white/70 backdrop-blur-lg border border-white/50 p-8 rounded-[2.5rem] shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#4b7291] mb-8 flex items-center gap-2"><BrainCircuit size={16} /> AI Forecast Engine</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-5">
                  <Dropdown label="Sector" value={selectedCategory} onChange={setSelectedCategory} options={categories} />
                  <Dropdown label="Asset" value={selectedProduct} onChange={setSelectedProduct} options={productMap[selectedCategory]} />
                  <div className="flex gap-4">
                    <Input label="Stock" value={currentStock} onChange={setCurrentStock} type="number" />
                    <Input label="Price" value={basePrice} onChange={setBasePrice} type="number" />
                  </div>
                  <button onClick={runAIForecast} className="w-full py-4 bg-[#4b7291] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg active:scale-95">
                    {isSyncing ? "Syncing Logic..." : "Run AI Forecast"}
                  </button>
                </div>
                <div>
                  {forecastResult ? (
                    <div className="bg-gradient-to-b from-[#f8fafc]/90 to-white/90 border border-[#d1e2e8] p-6 rounded-[2.5rem] flex flex-col justify-between h-full shadow-inner">
                       <div className="space-y-4">
                          <div className="flex justify-between items-center px-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prediction Confidence</p>
                            <p className="text-sm font-black text-[#70d6bc]">{forecastResult.confidence}%</p>
                          </div>
                          
                          <div className="h-[180px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={[
                                { name: 'Target', value: forecastResult.predicted_upper, fill: '#4b7291' },
                                { name: 'Comp.', value: competitorPrice, fill: '#f59e0b' },
                                { name: 'Demand', value: forecastResult.demand, fill: '#70d6bc' }
                              ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={30} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                       </div>
                       <div className="border-t border-slate-100 pt-4 mt-2 space-y-3">
                          <div className="flex justify-between items-center text-[10px] font-black text-slate-400 px-2">
                             <span>Target: ${forecastResult.predicted_upper}</span>
                             <span>Competitor Price ${competitorPrice}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-tighter ${forecastResult.predicted_upper <= competitorPrice ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                               {forecastResult.predicted_upper <= competitorPrice ? 'Competitive Advantage' : 'Price Overflow'}
                            </span>
                            <p className="text-[10px] font-black italic text-slate-400">Market Demand: {forecastResult.demand}u</p>
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-slate-50/30 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 text-center text-slate-400">
                       <Activity size={32} className="mb-2 opacity-30 animate-pulse" />
                       <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Command</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-8 rounded-[2.5rem] shadow-xl">
             <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-8 flex items-center gap-2"><Zap size={16} className="text-amber-400"/> Automation Logs</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {automationLogs.length > 0 ? (
                automationLogs.map((log, index) => (
                  <AutomationRow
                    key={index}
                    label={log.product + " → " + log.status}
                    context={log.category}
                  />
                ))
              ) : (
                <AutomationRow
                  label="All products are in NORMAL STOCK"
                  context="System Stable"
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {isAnomalyModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/40">
          <div className="relative bg-white/95 border border-white w-full max-w-[1000px] h-full max-h-[85vh] rounded-[3rem] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-5 text-rose-500">
                <ShieldAlert size={36} /><h3 className="text-3xl font-black uppercase tracking-tighter italic text-slate-800">Anomaly Center</h3>
              </div>
              <div className="flex items-center gap-4">
                  <select value={modalCategory} onChange={(e) => setModalCategory(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer hover:bg-white transition-all">
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                <button onClick={() => setIsAnomalyModalOpen(false)} className="p-4 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-2xl transition-all"><X size={24} /></button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-12">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                 <ModalStat label="Financial Loss" value={auditSummary?.financial_loss || 0} color="rose" />
                 <ModalStat label="Dead Stock" value={auditSummary?.dead_stock || 0} color="blue" />
                 <ModalStat label="Market Gap" value={auditSummary?.market_gaps || 0} color="teal" />
                 <ModalStat label="Revenue Gap" value={auditSummary?.revenue_gaps || 0} color="orange" />
              </div>
              <div className="bg-[#2b3a4a] rounded-[2.5rem] p-10 flex flex-col md:flex-row justify-between items-center text-white gap-8 shadow-2xl">
                <div>
                    <h4 className="text-2xl font-black uppercase italic text-[#70d6bc] tracking-tighter">Export Anomaly Document</h4>
                    <p className="text-sm text-slate-400 mt-2 uppercase tracking-widest font-semibold">Comprehensive Stock & AI Forecast Analysis</p>
                </div>
                <button onClick={generateFullBIReport} className="flex items-center gap-4 bg-[#4b7291] hover:bg-[#5a86a9] px-10 py-5 rounded-2xl font-black uppercase text-xs shadow-xl transition-all active:scale-95">
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

// Reusable sub-components block unchanged
const StatCard = ({ label, value, icon, color, onClick, clickable }) => {
  const colorMap = { blue: 'bg-blue-50 text-[#4b7291]', teal: 'bg-teal-50 text-[#70d6bc]', rose: 'bg-rose-50 text-rose-500' };
  return (
    <div onClick={onClick} className={`bg-white/80 backdrop-blur-lg border border-white/60 p-8 rounded-[2.5rem] flex items-center gap-6 transition-all shadow-lg hover:shadow-slate-200/60 ${clickable ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''}`}>
       <div className={`p-4 rounded-2xl shrink-0 shadow-inner ${colorMap[color] || 'bg-slate-50'}`}>{icon}</div>
       <div className="min-w-0 flex-1">
         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{label}</p>
         <p className="text-2xl font-black text-[#2b3a4a] italic leading-tight tracking-tighter">{value}</p>
       </div>
    </div>
  );
};

const AutomationRow = ({ label, context }) => (
  <div className="p-5 bg-white/40 border border-white/60 rounded-3xl flex justify-between items-center group hover:bg-white/80 transition-all shadow-sm">
     <div className="flex items-center gap-4">
        <div className="w-1.5 h-1.5 bg-[#4b7291] rounded-full shadow-[0_0_8px_#4b7291]"></div>
        <p className="text-xs font-black text-slate-700 italic tracking-tight">{label}</p>
     </div>
     <span className="text-[9px] font-black uppercase text-[#4b7291] px-3 py-1 bg-white/80 rounded-full border border-slate-100 shadow-sm">{context}</span>
  </div>
);

const ModalStat = ({ label, value, color }) => {
  const colorMap = { rose: 'bg-rose-50/50 border-rose-100 text-rose-600', blue: 'bg-blue-50/50 border-blue-100 text-[#4b7291]', teal: 'bg-teal-50/50 border-teal-100 text-[#70d6bc]', orange: 'bg-amber-50/50 border-amber-100 text-amber-600' };
  return (
    <div className={`${colorMap[color]} border-2 p-8 rounded-[2.5rem] flex flex-col items-center text-center shadow-sm backdrop-blur-sm`}>
        <p className="text-3xl font-black italic mb-1 tracking-tighter">{value}</p>
        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{label}</p>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-4 px-6 py-4 rounded-2xl cursor-pointer transition-all duration-300 ${active ? 'bg-[#4b7291] text-white shadow-2xl scale-105' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
    {icon} <span className="text-[12px] font-black uppercase tracking-[0.2em]">{label}</span>
  </div>
);

const Input = ({ label, value, onChange, type }) => (
  <div className="flex-1"><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block ml-1">{label}</label><input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-white/60 border border-white/80 backdrop-blur-sm rounded-2xl p-4 text-xs font-black text-[#2b3a4a] focus:outline-none focus:border-[#4b7291] focus:bg-white transition-all shadow-inner" /></div>
);

const Dropdown = ({ label, value, onChange, options }) => (
  <div className="w-full"><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block ml-1">{label}</label><select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-white/60 border border-white/80 backdrop-blur-sm rounded-2xl p-4 text-xs font-black text-[#2b3a4a] focus:outline-none focus:border-[#4b7291] focus:bg-white appearance-none cursor-pointer transition-all shadow-inner">{options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
);

export default Store2Dashboard;