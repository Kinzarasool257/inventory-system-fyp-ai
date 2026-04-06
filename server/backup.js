// backup.js
require('dotenv').config();
const mysqldump = require('mysqldump');
const path = require('path');
const fs = require('fs');

// Ensure backups folder exists
const backupsDir = path.join(__dirname, 'backups');
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir);
}

const createBackup = async () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(backupsDir, `backup-${timestamp}.sql`);

 

  try {
    await mysqldump({
      connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
      },
      dumpToFile: filePath,
    });

    console.log('✅ Backup created at:', filePath);
  } catch (err) {
    console.error('❌ Backup failed:', err);
  }
};

module.exports = createBackup;
