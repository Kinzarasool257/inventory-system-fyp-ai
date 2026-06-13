import db from "../db.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const getAuditSummary = async (req, res) => {
  try {
    const { warehouse, category } = req.query;

    let query = `
      SELECT 
        SUM(fault_loss_sale) AS financial_loss,
        SUM(fault_revenue_gap) AS data_gaps,
        SUM(fault_dead_stock) AS dead_stock,
        SUM(fault_market_price) AS market_gaps
      FROM vw_smart_stock_analysis
      WHERE 1=1
    `;

    let params = [];

    if (warehouse && warehouse !== "All Warehouses") {
      query += " AND warehouse_id = ?";
      params.push(warehouse);
    }

    if (category && category !== "All Categories") {
      query += " AND category = ?";
      params.push(category);
    }

    const [rows] = await db.query(query, params);

    res.json(rows); // ✅ single row with sums
    
  } catch (err) {
    console.error("❌ Audit Summary Error:", err);
    res.status(500).json({ error: err.message });
  }
};
const getAnomalies = async (req, res) => {
  const [rows] = await db.query(`
    SELECT date, warehouse_id, category, product_name,
           stock_level, unit_price, competitor_price,
           fault_dead_stock, fault_market_price
    FROM vw_smart_stock_analysis
    WHERE fault_loss_sale=1
    OR fault_revenue_gap=1
    OR fault_dead_stock=1
    OR fault_market_price=1
  `);

  res.json(rows);
};

// exports.generateAuditReport = async (req, res) => {
//   try {
//     const GROQ_API_KEY = process.env.GROQ_API_KEY;

//     const [rows] = await db.query(`
//       SELECT * FROM vw_smart_stock_analysis
//       WHERE fault_loss_sale=1
//       OR fault_dead_stock=1
//       OR fault_market_price=1
//     `);

//     const products = [...new Set(rows.map(r => r.product_name))].slice(0, 5);
//     const warehouses = [...new Set(rows.map(r => r.warehouse_id))].slice(0, 3);

//     const response = await axios.post(
//       "https://api.groq.com/openai/v1/chat/completions",
//       {
//         model: "llama-3.3-70b-versatile",
//         messages: [
//           {
//             role: "system",
//             content: "You are a forensic retail auditor."
//           },
//           {
//             role: "user",
//             content: `
// Analyze dataset:

// Faults: ${rows.length}
// Products: ${products.join(", ")}
// Warehouses: ${warehouses.join(", ")}

// Give 3-step action plan:
// 1. Pricing correction
// 2. Stock liquidation
// 3. Growth strategy
// `
//           }
//         ]
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${GROQ_API_KEY}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     res.json({
//       report: response.data.choices[0].message.content
//     });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
// const generateAuditReport = async (req, res) => {
//   try {
//     if (!process.env.GROQ_API_KEY) {
//       return res.status(400).json({ error: "API Key missing in .env!" });
//     }

//     // ------------------------------------------------------------------
//     // GET DATA FROM DB
//     // ------------------------------------------------------------------
//     const result = await db.query(`
//   SELECT * FROM vw_smart_stock_analysis
// `);

// const rows = Array.isArray(result[0]) ? result[0] : result.rows || result;
// const f_df = rows;

//     // ------------------------------------------------------------------
//     // AUTO EXTRACT CATEGORY + STORE
//     // ------------------------------------------------------------------
//     const aud_cat = [...new Set(f_df.map(r => r.category))].join(", ");
//     const aud_store = [...new Set(f_df.map(r => r.warehouse_id))].join(", ");

//     // ------------------------------------------------------------------
//     // FILTER FAULTY RECORDS
//     // ------------------------------------------------------------------
//     const faulty_records = f_df
//       .filter(row =>
//         row.fault_loss_sale === 1 ||
//         row.fault_revenue_gap === 1 ||
//         row.fault_dead_stock === 1 ||
//         row.fault_market_price === 1
//       )
//       .sort((a, b) => new Date(b.date) - new Date(a.date));

//     const sample_products = [...new Set(faulty_records.map(r => r.product_name))].slice(0, 5);
//     const sample_warehouses = [...new Set(faulty_records.map(r => r.warehouse_id))].slice(0, 3);

//     const summary = {
//       Scope: `${aud_cat} in ${aud_store}`,
//       Financial_Loss: f_df.reduce((a, b) => a + (b.fault_loss_sale || 0), 0),
//       Dead_Stock: f_df.reduce((a, b) => a + (b.fault_dead_stock || 0), 0),
//       Overpriced_Items: f_df.reduce((a, b) => a + (b.fault_market_price || 0), 0),
//       Affected_Products: sample_products,
//       Affected_Warehouses: sample_warehouses
//     };

//     // ------------------------------------------------------------------
//     // AI PROMPT (same as before)
//     // ------------------------------------------------------------------
//     const auditorPrompt = `
// You are a Forensic Retail Auditor.

// Analyze ONLY this data:
// ${JSON.stringify(summary)}
// `;

//     const auditorResponse = await axios.post(
//       "https://api.groq.com/openai/v1/chat/completions",
//       {
//         model: "llama-3.3-70b-versatile",
//         messages: [{ role: "user", content: auditorPrompt }],
//         temperature: 0.1
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     const auditText = auditorResponse.data.choices[0].message.content;

//     const managerPrompt = `
// You are a Chief Operations Officer.

// Audit:
// ${auditText}

// Products: ${JSON.stringify(sample_products)}
// Warehouses: ${JSON.stringify(sample_warehouses)}

// Make 3-step plan.
// `;

//     const managerResponse = await axios.post(
//       "https://api.groq.com/openai/v1/chat/completions",
//       {
//         model: "llama-3.3-70b-versatile",
//         messages: [{ role: "user", content: managerPrompt }],
//         temperature: 0.1
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     return res.json({
//       success: true,
//       report: managerResponse.data.choices[0].message.content,
//       faulty_records: faulty_records.slice(0, 100),
//       summary
//     });

//   } catch (e) {
//     return res.status(500).json({
//       error: e.message
//     });
//   }
// };

// export {
//   getAuditSummary,
//   getAnomalies,
//   generateAuditReport
// };

const generateAuditReport = async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(400).json({
        success: false,
        error: "GROQ_API_KEY missing"
      });
    }

    const warehouse_id = req.query.warehouse_id;

    let query = `
      SELECT *
      FROM vw_smart_stock_analysis
    `;

    const params = [];

    if (warehouse_id) {
      query += ` WHERE warehouse_id = ?`;
      params.push(warehouse_id);
    }

    const result = await db.query(query, params);

    const rows = Array.isArray(result?.[0])
      ? result[0]
      : Array.isArray(result)
        ? result
        : [];

    if (!rows || rows.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No records found",
        warehouse_filter: warehouse_id || "ALL",
        data: []
      });
    }

    // =========================
    // FIX CATEGORY SAFELY
    // =========================
    const getCategory = (r) =>
      r.Category || r.category || r.category_name || "UNKNOWN";

    const warehouses = [...new Set(rows.map(r => r.warehouse_id))];

    const warehouseSummary = {};

    warehouses.forEach((warehouse) => {
      const warehouseRows = rows.filter(
        r => r.warehouse_id === warehouse
      );

      const faultyRows = warehouseRows.filter(
        r =>
          r.fault_loss_sale === 1 ||
          r.fault_revenue_gap === 1 ||
          r.fault_dead_stock === 1 ||
          r.fault_market_price === 1
      );

      const categories = [
        ...new Set(warehouseRows.map(getCategory))
      ];

      warehouseSummary[warehouse] = {
        warehouse,
        total_records: warehouseRows.length,
        total_categories: categories.length,
        categories,

        financial_loss_cases: warehouseRows.reduce(
          (sum, r) => sum + (r.fault_loss_sale || 0),
          0
        ),

        dead_stock_cases: warehouseRows.reduce(
          (sum, r) => sum + (r.fault_dead_stock || 0),
          0
        ),

        revenue_gap_cases: warehouseRows.reduce(
          (sum, r) => sum + (r.fault_revenue_gap || 0),
          0
        ),

        overpriced_cases: warehouseRows.reduce(
          (sum, r) => sum + (r.fault_market_price || 0),
          0
        ),

        total_inventory_value: warehouseRows.reduce(
          (sum, r) =>
            sum + (r.stock_qty || 0) * (r.selling_price || 0),
          0
        ),

        potential_revenue_loss: warehouseRows.reduce(
          (sum, r) =>
            sum + (r.fault_revenue_gap || 0) * (r.selling_price || 0),
          0
        ),

        dead_stock_value: warehouseRows.reduce(
          (sum, r) =>
            sum + (r.fault_dead_stock || 0) * (r.selling_price || 0),
          0
        ),

        affected_products: [
          ...new Set(faultyRows.map(r => r.Product_Name))
        ],

        affected_categories: [
          ...new Set(faultyRows.map(getCategory))
        ]
      };
    });

    // =========================
    // GROUP FAULTY RECORDS BY CATEGORY
    // =========================
    const groupedFaultyRecords = {};

    rows.forEach(r => {
      const isFault =
        r.fault_loss_sale === 1 ||
        r.fault_revenue_gap === 1 ||
        r.fault_dead_stock === 1 ||
        r.fault_market_price === 1;

      if (!isFault) return;

      const cat = getCategory(r);

      if (!groupedFaultyRecords[cat]) {
        groupedFaultyRecords[cat] = {
          category: cat,
          total_faults: 0,
          products: [],
          warehouses: new Set()
        };
      }

      groupedFaultyRecords[cat].total_faults += 1;
      groupedFaultyRecords[cat].products.push(r.Product_Name);
      groupedFaultyRecords[cat].warehouses.add(r.Warehouse_ID);
    });

    Object.keys(groupedFaultyRecords).forEach(cat => {
      groupedFaultyRecords[cat].warehouses = [
        ...groupedFaultyRecords[cat].warehouses
      ];

      groupedFaultyRecords[cat].products = [
        ...new Set(groupedFaultyRecords[cat].products)
      ].slice(0, 10);
    });

    // =========================
    // AI PROMPT
    // =========================
    const auditorPrompt = `
You are a Senior Retail Forensic Auditor.

Analyze this structured warehouse data:

${JSON.stringify(warehouseSummary, null, 2)}

Generate a professional audit report:
1. Executive Summary
2. Warehouse Risk Ranking
3. Category-wise Loss Analysis
4. Revenue Leakage
5. Dead Stock Analysis
6. Pricing Issues
7. Financial Impact
8. Recommendations
`;

    const auditorResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: auditorPrompt }],
        temperature: 0.1
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const auditText = auditorResponse.data.choices[0].message.content;

    const managerPrompt = `
You are the COO.

Based on this audit:

${auditText}

Create action plan:
1. Immediate
2. Mid-term
3. Long-term

Include priority + impact.
`;

    const managerResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: managerPrompt }],
        temperature: 0.1
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log(warehouseSummary)
    return res.json({
      success: true,
      warehouse_filter: warehouse_id || "ALL",
      total_warehouses: warehouses.length,
      warehouse_summary: warehouseSummary,

      // 🔥 CLEAN OUTPUT (FIXED)
      faulty_records: groupedFaultyRecords,

      report: managerResponse.data.choices[0].message.content
    });

  } catch (error) {
    console.error("Audit Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
export {
   getAuditSummary,
   getAnomalies,
   generateAuditReport
 };