// // import React, { useState, useEffect } from "react";
// // import axios from "axios";

// // import {
// //   LineChart,
// //   Line,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   CartesianGrid
// // } from "recharts";

// // export default function StockDashboard() {

// //   const [data, setData] = useState([]);

// //   const [store, setStore] = useState("");
// //   const [item, setItem] = useState("");

// //   const [stock, setStock] = useState(50);
// //   const [price, setPrice] = useState(100);

// //   const [prediction, setPrediction] = useState(null);

// //   useEffect(() => {

// //     axios.get("http://localhost:3002/api/data")
// //       .then(res => setData(res.data));

// //   }, []);

// //   const stores = [...new Set(data.map(d => d.store))];

// //   const items = data
// //     .filter(d => d.store === store)
// //     .map(d => d.item);

// //   const filteredData = data.filter(
// //     d => d.store === store && d.item === item
// //   );

// //   const runPrediction = async () => {

// //     const res = await axios.post(
// //       "http://localhost:3002/api/predict",
// //       {
// //         store,
// //         item,
// //         stock,
// //         price
// //       }
// //     );

// //     setPrediction(res.data);
// //   };

// //   return (

// //     <div style={{ padding: 20 }}>

// //       <h1>Smart Stock Manager Dashboard</h1>

// //       {/* Filters */}

// //       <select onChange={e => setStore(e.target.value)}>

// //         <option>Select Store</option>

// //         {stores.map(s =>
// //           <option key={s}>{s}</option>
// //         )}

// //       </select>

// //       <select onChange={e => setItem(e.target.value)}>

// //         <option>Select Item</option>

// //         {items.map(i =>
// //           <option key={i}>{i}</option>
// //         )}

// //       </select>

// //       <br /><br />

// //       Stock:

// //       <input
// //         type="number"
// //         value={stock}
// //         onChange={e => setStock(e.target.value)}
// //       />

// //       Price:

// //       <input
// //         type="number"
// //         value={price}
// //         onChange={e => setPrice(e.target.value)}
// //       />

// //       <br /><br />

// //       <button onClick={runPrediction}>
// //         Run AI Prediction
// //       </button>

// //       {/* Prediction Result */}

// //       {prediction && (

// //         <div>

// //           <h2>Demand: {prediction.prediction}</h2>

// //           <h2>Price: {prediction.price}</h2>

// //           <h2>Status: {prediction.status}</h2>

// //         </div>

// //       )}

// //       {/* Chart */}

// //       <LineChart
// //         width={600}
// //         height={300}
// //         data={filteredData}
// //       >

// //         <CartesianGrid stroke="#ccc" />

// //         <XAxis dataKey="date" />

// //         <YAxis />

// //         <Tooltip />

// //         <Line
// //           type="monotone"
// //           dataKey="sales"
// //         />

// //       </LineChart>

// //       {/* Table */}

// //       <table border="1">

// //         <thead>

// //           <tr>
// //             <th>Date</th>
// //             <th>Sales</th>
// //           </tr>

// //         </thead>

// //         <tbody>

// //           {filteredData.slice(-10).map((row, index) => (

// //             <tr key={index}>

// //               <td>{row.date}</td>
// //               <td>{row.sales}</td>

// //             </tr>

// //           ))}

// //         </tbody>

// //       </table>

// //     </div>

// //   );

// // }
// // App.js
// // App.js
// import React, { useState } from "react";
import "./App.css"

// // Dummy data for table
// const dummyData = [
//   { store: "Store 1", invoice_no: "I195736", date: "5/30/2025 17:14", customer_id: "C932636", gender: "Female", age: 22, category: "Shoes", quantity: 1, selling_price_per_unit: 1849.23, total_profit: 277.38, payment_method: "Cash", state: "California", item: "Boots", sales: 1849.23 },
//   { store: "Store 1", invoice_no: "I394444", date: "5/30/2025 11:12", customer_id: "C93073", gender: "Female", age: 53, category: "Shoes", quantity: 5, selling_price_per_unit: 1849.23, total_profit: 1386.92, payment_method: "Cash", state: "California", item: "Boots", sales: 9246.16 },
//   { store: "Store 1", invoice_no: "I617909", date: "5/30/2025 20:26", customer_id: "C545384", gender: "Female", age: 60, category: "Shoes", quantity: 1, selling_price_per_unit: 1849.23, total_profit: 277.38, payment_method: "Cash", state: "California", item: "Boots", sales: 1849.23 },
//   { store: "Store 1", invoice_no: "I973060", date: "5/30/2025 10:38", customer_id: "C849787", gender: "Female", age: 20, category: "Shoes", quantity: 2, selling_price_per_unit: 1849.23, total_profit: 554.77, payment_method: "Cash", state: "California", item: "Boots", sales: 3698.46 },
// ];

// function StockDashboard() {
//   const [store, setStore] = useState("Store 1");
//   const [category, setCategory] = useState("Boots");
//   const [stock, setStock] = useState(50);
//   const [price, setPrice] = useState(100);
//   const [showAI, setShowAI] = useState(false);

//   const handleRunForecast = () => {
//     setShowAI(true);
//   };

//   return (
//     <div className="dashboard">
//       <div className="sidebar">
//         <h2>Control Panel</h2>
//         <label>Select Store</label>
//         <select value={store} onChange={(e) => setStore(e.target.value)}>
//           <option>Store 1</option>
//           <option>Store 2</option>
//           <option>Store 3</option>
//         </select>

//         <label>Select Item Category</label>
//         <select value={category} onChange={(e) => setCategory(e.target.value)}>
//           <option>Boots</option>
//           <option>Shoes</option>
//           <option>Sneakers</option>
//         </select>

//         <label>Current Physical Stock</label>
//         <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />

//         <label>Base Selling Price ($)</label>
//         <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />

//         <button onClick={handleRunForecast}>Run AI Forecast</button>
//       </div>

//       <div className="main">
//         <h1>🚀 Smart Stock Manager - Interactive Dashboard</h1>
//         <h3>📊 Live Inventory Records: {store}</h3>

//         <div className="table-container">
//           <table>
//             <thead>
//               <tr>
//                 {Object.keys(dummyData[0]).map((col) => (
//                   <th key={col}>{col}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {dummyData.map((row, idx) => (
//                 <tr key={idx}>
//                   {Object.values(row).map((val, i) => (
//                     <td key={i}>{val}</td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {showAI && (
//           <div className="ai-analytics">
//             <h2>🧠 AI Smart Analytics</h2>
//             <div className="analytics-item">
//               <p><strong>Tomorrow's Demand:</strong> 5012.7 Units</p>
//               <p><strong>AI Suggested Price:</strong> ${price}</p>
//               <p style={{ color: "red" }}><strong>Inventory Status:</strong> Critical: Reorder Now</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default StockDashboard;
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

  // Fetch data when store or item changes
  useEffect(() => {
    if (!store) return;

    setLoading(true);

    axios
      .get("http://localhost:3002/api/data", {
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
  }, [store, item]);

  // Extract unique stores and items
  const stores = [...new Set(data.map(d => d.store))];
  const items = [...new Set(data.filter(d => d.store === store).map(d => d.item))];

  const runPrediction = async () => {
    try {
      const res = await axios.post("http://localhost:3002/api/predict", {
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
