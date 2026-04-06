const cron = require('node-cron');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const uploadBackup = require('./uploadbackup');
require('dotenv').config();
// DB Credentials
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT; 

// Backup directory
const backupDir = path.join(__dirname, 'backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// 🕑 Schedule: Runs every day at 2:00 AM
cron.schedule('0 2 * * *', () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(backupDir, `auto-backup-${timestamp}.sql`);
  const dumpCommand = `mysqldump -u ${DB_USER} -P ${DB_PORT} ${DB_PASSWORD ? `-p${DB_PASSWORD}` : ''} ${DB_NAME} > "${filePath}"`;

  exec(dumpCommand, async (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Auto backup failed:', error);
    } else {
      console.log('✅ Auto backup created at:', filePath);

      // ✅ Upload to Google Drive
      try {
        await uploadBackup(filePath);
      } catch (err) {
        console.error('❌ Upload failed:', err);
      }
    }
  });
});