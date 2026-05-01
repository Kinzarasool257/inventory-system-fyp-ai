// routes/stockRoutes.js

const express = require('express');
const router = express.Router();
const { getTotalStock  } = require('../controller/stockController');
const db = require("../db");
router.get('/total-stock', getTotalStock);
router.get("/warehouse-category-stock", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        Warehouse_ID,
        Category,
        SUM(Stock_Level) AS total_stock
      FROM vw_smart_stock_analysis
      GROUP BY Warehouse_ID, Category
    `);

    // 🔥 FIX: handle both possible formats
    const rows = Array.isArray(result[0]) ? result[0] : result;

    if (!Array.isArray(rows)) {
      return res.status(500).json({
        error: "Unexpected DB response format",
        debug: result
      });
    }

    const formatted = {};

    rows.forEach(row => {
      if (!formatted[row.Warehouse_ID]) {
        formatted[row.Warehouse_ID] = {};
      }

      formatted[row.Warehouse_ID][row.Category] = row.total_stock;
    });

    res.json(formatted);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;