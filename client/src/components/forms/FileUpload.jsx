import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [table, setTable] = useState('products');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [validatedData, setValidatedData] = useState([]);

  const handleUpload = async () => {
    if (!file || !table) {
      setMessage('❗ Please select a file and table');
      return;
    }

    const formData = new FormData();
    formData.append('excel', file);
    formData.append('table', table);

    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post('http://localhost:3002/import-excel', formData);
      setMessage(res.data.message);
      setValidatedData(res.data.validatedData || []);
      console.log('✅ ValidatedData:', res.data.validatedData);
    } catch (err) {
      setMessage(err.response?.data?.error || '❌ Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">📊 Excel Import Panel</h1>
        <p className="text-sm text-gray-500 text-center">Upload Excel file to import data into the selected table.</p>

        {/* Table Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Table</label>
          <select
            value={table}
            onChange={(e) => setTable(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="products">🛒 Products</option>
            <option value="customers">👥 Customers</option>
          </select>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Excel File</label>
          <input
            type="file"
            accept=".xlsx, .xls"
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        {/* Upload Button */}
        <div className="flex justify-center">
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Uploading...' : 'Upload & Validate'}
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`text-center text-sm font-medium px-4 py-2 rounded-lg ${
              message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {message}
          </div>
        )}

        {/* Validated Table */}
        {validatedData.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">✅ Validated Data:</h2>
            <div className="overflow-x-auto max-h-96 border rounded-lg">
              <table className="min-w-full text-sm text-left border border-gray-300">
                <thead className="bg-indigo-100 text-gray-700">
                  <tr>
                    {Object.keys(validatedData[0]).map((key, index) => (
                      <th key={index} className="px-3 py-2 border">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {validatedData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-t">
                      {Object.keys(validatedData[0]).map((key, colIndex) => (
                        <td
                          key={colIndex}
                          className={`px-3 py-1 border ${
                            row.Status === 'TRUE'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {row[key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Download Button */}
            <a
              href="http://localhost:3002/download"
              className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              download
            >
              ⬇ Download Validated Excel
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
