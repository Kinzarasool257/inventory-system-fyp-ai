import db from '../db.js';






export const getTotalStock = async (req, res) => {
  try {

    const totalResult = await db.query(`
      SELECT SUM(Stock_Level) AS totalStock 
      FROM vw_smart_stock_analysis
    `);

    const warehouseResult = await db.query(`
      SELECT Warehouse_ID, SUM(Stock_Level) AS stock
      FROM vw_smart_stock_analysis
      GROUP BY Warehouse_ID
    `);

    // 🔥 SAFE EXTRACTION (FIX)
    const totalRows = Array.isArray(totalResult[0]) ? totalResult[0] : totalResult;
    const warehouseRows = Array.isArray(warehouseResult[0]) ? warehouseResult[0] : warehouseResult;

    const breakdown = {};

    (warehouseRows || []).forEach(row => {
      breakdown[row.Warehouse_ID] = row.stock;
    });

    const response = {
      totalStock: totalRows?.[0]?.totalStock || 0,
      breakdown
    };



    res.json(response);

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};
