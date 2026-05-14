const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/automation-logs", async (req, res) => {
  try {
    const { store } = req.query;

    if (!store) {
      return res.status(400).json({ message: "store required" });
    }

    const result = await db.query(
      `
      SELECT 
        Product_Name,
        SUM(Stock_Level) AS Stock_Level,
        Warehouse_ID,
        Category
      FROM vw_smart_stock_analysis
      WHERE Warehouse_ID = ?
      GROUP BY Product_Name, Warehouse_ID, Category
      `,
      [store]
    );

    const rows = Array.isArray(result?.[0]) ? result[0] : result || [];

    if (!Array.isArray(rows)) {
      return res.status(500).json({
        message: "Invalid DB response format",
        debug: result,
      });
    }

    const totalStock = rows.reduce(
      (sum, item) => sum + Number(item.Stock_Level || 0),
      0
    );

    const productCount = rows.length || 1;
    const avgStock = totalStock / productCount;

    const underThreshold = avgStock * 0.7;
    const overThreshold = avgStock * 1.3; // ⚠️ FIXED (you wrote 0.5 by mistake)

    const productLogs = rows.map((item) => {
      const stock = Number(item.Stock_Level || 0);

      let status = "NORMAL STOCK";

      if (stock < underThreshold) {
        status = "UNDERSTOCK - RESTOCKING NEEDED";
      } else if (stock > overThreshold) {
        status = "OVERSTOCK - CLEAR INVENTORY";
      }

      return {
        product: item.Product_Name,
        stock,
        category: item.Category,
        warehouse: item.Warehouse_ID,
        status,
      };
    });

    res.json({
      store,
      summary: {
        totalStock,
        avgStock,
        underThreshold,
        overThreshold,
      },
      productLogs,
    });

  } catch (error) {
    console.error("Automation Logs Error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

module.exports = router;