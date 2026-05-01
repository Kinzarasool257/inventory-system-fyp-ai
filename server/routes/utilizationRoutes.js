const express = require("express");
const router = express.Router();
const db = require('../db');
// AI default capacity
const DEFAULT_CAPACITY = 80000;

// User-defined capacities (temporary storage)
const capacityMap = {
  "WH-1": 100000,
  "WH-2": 120000,
  "WH-3": 90000,
  "WH-4": 110000
};

router.get("/space-utilization", async (req, res) => {
  try {
    const resultDB = await db.query(`
      SELECT Warehouse_ID, SUM(Stock_Level) as stock
      FROM vw_smart_stock_analysis
      GROUP BY Warehouse_ID
    `);

    // ✅ NORMALIZE ROWS SAFELY
    let rows = [];

    if (Array.isArray(resultDB)) {
      rows = Array.isArray(resultDB[0]) ? resultDB[0] : resultDB;
    } else if (resultDB?.rows) {
      rows = resultDB.rows;
    } else {
      rows = [];
    }

    const capacityMap = {
      "WH-1": 10500000,
      "WH-2": 18920000,
      "WH-3": 59670000,
      "WH-4": 2110000
    };

    const result = rows.map(r => {
      const capacity = capacityMap[r.Warehouse_ID] || 1;

      return {
        warehouse: r.Warehouse_ID,
        stock: Number(r.stock),
        capacity,
        utilization: Number(((r.stock / capacity) * 100).toFixed(2))
      };
    });

    res.json({ data: result });

  } catch (err) {
    console.error("UTILIZATION ERROR:", err);
    res.status(500).json({ error: "Failed to calculate utilization" });
  }
});
module.exports = router;