const express = require('express');
const router = express.Router();
const db = require('../db');

// GET total revenue by warehouse
// router.get('/warehouse/:warehouseId', async (req, res) => {
//   try {
//     const { warehouseId } = req.params;

//     const [rows] = await db.query(
//       `
//       SELECT 
//         Warehouse_ID AS warehouse_id,
//         SUM(Revenue) AS total_revenue
//       FROM vw_smart_stock_analysis
//       WHERE Warehouse_ID = ?
//       GROUP BY Warehouse_ID
//       `,
//       [warehouseId]
//     );

//     // ✅ SAFE fallback (no crash)
//     if (!rows || rows.length === 0) {
//       return res.json({
//         warehouse_id: warehouseId,
//         total_revenue: 0
//       });
//     }

//     const row = rows[0];

//     res.json({
//       warehouse_id: row.warehouse_id,
//       total_revenue: row.total_revenue || 0
//     });

//   } catch (error) {
//     console.error("Revenue API error:", error);
//     res.status(500).json({
//       error: "Server error"
//     });
//   }
// // });

router.get('/warehouse/:warehouseId', async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const [rows] = await db.query(`
      SELECT COALESCE(SUM(Revenue), 0) AS totalRevenue
      FROM vw_smart_stock_analysis WHERE Warehouse_ID = ?
      GROUP BY Warehouse_ID` ,  [warehouseId]);
   
    const totalRevenue = rows?.totalRevenue ?? 0;

    res.json({
      totalRevenue
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch revenue' });
  }
});

module.exports = router;