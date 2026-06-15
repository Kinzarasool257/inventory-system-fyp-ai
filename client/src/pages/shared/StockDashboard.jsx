import React, { useState, useEffect } from "react";
import axios from "axios";

function StockDashboard() {
  const [data, setData] = useState([]);
  const [store, setStore] = useState("Store 1");
  const [item, setItem] = useState("Boots");
  const [stock, setStock] = useState(50);
  const [price, setPrice] = useState(100);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🌐 Global dynamic base path environment configuration string
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://inventory-system-fyp-ai-production.up.railway.app';

  // Fetch data when store or item changes
  useEffect(() => {
    if (!store) return;

    setLoading(true);

    // 🛠️ Changed network root string to pull dynamically from environmental context config
    axios
      .get(`${baseUrl}/api/data`, {
        params: { store, item } // send filters as query params
      })
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [store, item, baseUrl]);

  // Extract unique stores and items
  const stores = [...new Set(data.map(d => d.store))];
  const items = [...new Set(data.filter(d => d.store === store).map(d => d.item))];

  const runPrediction = async () => {
    try {
      // 🛠️ Changed network root string to pull dynamically from environmental context config
      const res = await axios.post(`${baseUrl}/api/predict`, {
        store,
        item,
        stock,
        price
      });
      setPrediction(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Control Panel</h2>

        <label>Select Store</label>
        <select value={store} onChange={(e) => setStore(e.target.value)}>
          <option value="">Select Store</option>
          {stores.map((s) => <option key={s}>{s}</option>)}
        </select>

        <label>Select Item</label>
        <select value={item} onChange={(e) => setItem(e.target.value)}>
          <option value="">Select Item</option>
          {items.map((i) => <option key={i}>{i}</option>)}
        </select>

        <label>Current Physical Stock</label>
        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />

        <label>Base Selling Price ($)</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />

        <button onClick={runPrediction}>Run AI Forecast</button>
      </div>

      <div className="main">
        <h1>🚀 Smart Stock Manager Dashboard</h1>

        {loading ? <p>Loading data...</p> : (
          <>
            <h3>📊 Inventory Records</h3>
            <table>
              <thead>
                <tr>
                  {data[0] && Object.keys(data[0]).map((col) => <th key={col}>{col}</th>)}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).map((val, i) => <td key={i}>{val}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {prediction && (
          <div className="ai-analytics">
            <h2>🧠 AI Smart Analytics</h2>
            <p><strong>Tomorrow's Demand:</strong> {prediction.demand} Units</p>
            <p><strong>AI Suggested Price:</strong> ${prediction.price}</p>
            <p style={{ color: "red" }}><strong>Inventory Status:</strong> {prediction.status}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StockDashboard;