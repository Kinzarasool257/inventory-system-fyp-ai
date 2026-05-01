const express = require("express");
const router = express.Router();
const db = require("../db"); // your mysql/pg connection

router.get("/market-audit/:warehouseId", async (req, res) => {
  try {
    const { warehouseId } = req.params;

    const rows = await db.query(
      `
      SELECT 
          Category,
          ROUND(AVG(Unit_Price), 2) AS unit_price,
          ROUND(AVG(Competitor_Price), 2) AS competitor_price
      FROM vw_smart_stock_analysis
      WHERE Warehouse_ID = ?
      GROUP BY Category
      `,
      [warehouseId]
    );

  

    // if mysql2 returns [rows, fields]
    const data = Array.isArray(rows[0]) ? rows[0] : rows;

    const result = data.map(r => ({
      category: r.Category,
      unit_price: Number(r.unit_price),
      competitor_price: Number(r.competitor_price)
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch market audit data" });
  }
});
module.exports = router;