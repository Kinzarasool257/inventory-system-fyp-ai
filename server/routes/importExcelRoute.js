const express = require('express');
const multer = require('multer');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const db = require('../db');
const util = require('util');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
db.query = util.promisify(db.query).bind(db);

router.post('/import-excel', upload.single('excel'), async (req, res) => {
  try {
    const table = req.body.table;
    const filePath = req.file.path;

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.worksheets[0];

    const headers = worksheet.getRow(1).values.slice(1);
    const data = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const rowData = {};
      headers.forEach((header, index) => {
        rowData[header] = row.getCell(index + 1).value;
      });
      data.push(rowData);
    });

    const dbColsRaw = await db.query(`SHOW COLUMNS FROM \`${table}\``);
    const dbCols = dbColsRaw.map(col => col.Field).filter(f => f !== 'id');

    const mismatch = headers.some(h => !dbCols.includes(h));
    if (mismatch) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: '❌ Excel headers do not match table columns' });
    }

    const validatedData = [];

    for (const row of data) {
      const cost = row['cost_per_bag'];
      const isValid = !isNaN(parseFloat(cost)) && isFinite(cost);
      const status = isValid ? 'TRUE' : 'Error: cost should be any number';

      if (isValid) {
        const values = dbCols.map(h => row[h]);
        const result = await db.query(
          `INSERT INTO \`${table}\` (${dbCols.join(',')}) VALUES (${dbCols.map(() => '?').join(',')})`,
          values
        );
        const insertId = result.insertId; // ✅ NEW: id from DB
        validatedData.push({ id: insertId, ...row, Status: status });
      } else {
        validatedData.push({ id: null, ...row, Status: status });
      }
    }

    // ✅ Create validated output Excel with id too
    const outputWorkbook = new ExcelJS.Workbook();
    const outputSheet = outputWorkbook.addWorksheet('Validated');

    outputSheet.columns = Object.keys(validatedData[0]).map(key => ({
      header: key,
      key: key,
      width: 25,
    }));

    validatedData.forEach(row => {
      const newRow = outputSheet.addRow(row);
      const statusCell = newRow.getCell('Status');
      if (row.Status === 'TRUE') {
        statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C6EFCE' } };
        statusCell.font = { color: { argb: '006100' } };
      } else {
        statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC7CE' } };
        statusCell.font = { color: { argb: '9C0006' } };
      }
    });

    const outputPath = path.join(__dirname, '../uploads/validated_output.xlsx');
    await outputWorkbook.xlsx.writeFile(outputPath);
    fs.unlinkSync(filePath);

    res.json({
      message: '✅ File validated and data imported!',
      validatedData: validatedData,
    });
  } catch (err) {
    console.error('❌ Excel import error:', err);
    res.status(500).json({ error: '❌ Failed to process Excel file' });
  }
});

router.get('/download', (req, res) => {
  const filePath = path.join(__dirname, '../uploads/validated_output.xlsx');
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

module.exports = router;
