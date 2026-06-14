const express = require("express");
const db = require("../db2");
const askGroq = require("../groq");

const router = express.Router();

const systemPrompt = `
You are an AI Inventory Database Assistant.

DATABASE SCHEMA

TABLE: cleaned_smart_stock
COLUMNS:
id
Transaction_ID
Date
Warehouse_ID
Category
Product_Name
Supplier_Name
Stock_Level
Units_Sold
Unit_Price
Purchase_Cost
Competitor_Price
Discount_Percent
Revenue
Payment_Method
Anomaly_Flag

TABLE: vw_smart_stock_analysis
COLUMNS:
id
Transaction_ID
Date
Warehouse_ID
Category
Product_Name
Supplier_Name
Stock_Level
Units_Sold
Unit_Price
Purchase_Cost
Competitor_Price
Discount_Percent
Revenue
Payment_Method
Anomaly_Flag
price_gap_pct
net_price
fault_loss_sale
fault_revenue_gap
fault_market_price
fault_dead_stock

TABLE: users
COLUMNS:
id
email
name
password
role

=================================================

STRICT RULES

1. ONLY generate SELECT queries.

2. NEVER generate:
INSERT
UPDATE
DELETE
DROP
ALTER
TRUNCATE
CREATE
REPLACE
RENAME

3. If user asks to modify data:
Return exactly:
UNSUPPORTED_OPERATION

4. Use ONLY columns that exist in schema.

5. NEVER invent columns.

6. BUSINESS MAPPING

stock = Stock_Level
quantity = Stock_Level
inventory = Stock_Level
items = Stock_Level

sales = Units_Sold
sold = Units_Sold

selling price = Unit_Price
price = Unit_Price

cost price = Purchase_Cost
cost = Purchase_Cost

7. Use vw_smart_stock_analysis when user asks about:
- analysis
- anomaly
- fault
- dead stock
- revenue gap
- price gap
- market price issue

8. Use cleaned_smart_stock for inventory, stock, sales, products, warehouses and suppliers.

9. Use users table only for user questions.

10. Add LIMIT 100 unless query uses:
COUNT
SUM
AVG
MIN
MAX
GROUP BY

11. Return ONLY SQL.
No explanation.
No markdown.
No extra text.

12.IMPORTANT SALES RULE:
If user asks about:
- sold the most
- top selling
- highest sales
- most sold

YOU MUST USE:
Units_Sold
NOT Stock_Level

13.If question contains:
- highest stock
- top product
- most stock
- maximum inventory

YOU MUST USE:
GROUP BY Product_Name
SUM(Stock_Level)
ORDER BY SUM DESC
LIMIT 1
`;

router.post("/", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        answer: "Please enter a question."
      });
    }

    const userQuestion = question.trim().toLowerCase();

    // Greetings
const greetings = [
  "hi",
  "hii",
  "hello",
  "hey",
  "good morning",
  "good afternoon",
  "good evening"
];

if (greetings.includes(userQuestion)) {
  return res.json({
    answer:
      "👋 Hello! I'm your Inventory AI Assistant.\n\nAsk me about stock levels, sales, top products, revenue, warehouses, suppliers, or anomalies."
  });
}

    // Block destructive requests before LLM
    const dangerousWords = [
      "delete",
      "drop",
      "truncate",
      "update",
      "insert",
      "alter",
      "create",
      "rename",
      "replace"
    ];

    if (
      dangerousWords.some(word =>
        userQuestion.includes(word)
      )
    ) {
      return res.json({
        answer:
          "I can't perform database modification operations. I can only retrieve information from the inventory system."
      });
    }

    // STEP 1: Generate SQL
    const sql = await askGroq([
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: question
      }
    ]);

    let cleanedSQL = sql
      .replace(/```sql/g, "")
      .replace(/```/g, "")
      .trim();

    // LLM rejected modification request
    if (
      cleanedSQL === "UNSUPPORTED_OPERATION"
    ) {
      return res.json({
        answer:
          "I can't perform database modification operations. I can only retrieve information from the inventory system."
      });
    }

    const lowerSQL = cleanedSQL.toLowerCase();

    // Security Layer
    const forbiddenWords = [
      "insert",
      "update",
      "delete",
      "drop",
      "alter",
      "truncate",
      "create",
      "replace",
      "rename"
    ];

    if (
      forbiddenWords.some(word =>
        lowerSQL.includes(word)
      )
    ) {
      return res.json({
        answer:
          "I can't perform database modification operations. I can only retrieve information from the inventory system."
      });
    }

    if (!lowerSQL.startsWith("select")) {
      return res.json({
        answer:
          "I can only execute SELECT queries."
      });
    }

    // STEP 2: Execute Query
    const [rows] = await db.query(cleanedSQL);

    // STEP 3: Generate Human Response
    const finalAnswer = await askGroq([
      {
        role: "system",
        content: `
You are a professional Inventory Management Assistant.

RULES:

1. Never mention SQL.
2. Never mention database tables.
3. Never mention technical details.
4. Never say:
   - not enough information
   - unable to determine
   - database result

5. If result is empty:
Generate a business-friendly message.

Examples:
- There are currently no low stock products.
- No matching inventory records were found.
- There are currently no anomalies detected.
- No products match your search criteria.

6. If result contains data:
Summarize findings clearly.

Examples:
- 5 products are currently low in stock and should be restocked soon.
- Warehouse WH-1 generated the highest revenue.
- 3 products have been flagged as dead stock.

7. Keep answer under 3 sentences.
8. Professional business tone.
9. Use only provided data.
`
      },
      {
        role: "user",
        content: `
User Question:
${question}

Query Result:
${JSON.stringify(rows)}
`
      }
    ]);

    res.json({
      sql: cleanedSQL,
      answer: finalAnswer,
      data: rows
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
      answer:
        "An error occurred while processing your request."
    });
  }
});

module.exports = router;

