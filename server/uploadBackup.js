const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

async function authorize() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error('❌ credentials.json file not found.');
  }

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_secret, client_id, redirect_uris } = credentials.web;

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  if (!fs.existsSync(TOKEN_PATH)) {
    throw new Error('❌ token.json file not found. Please authorize first using authServer.js.');
  }

  const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
  oAuth2Client.setCredentials(token);

  return oAuth2Client;
}

async function uploadBackup(filePath) {
  const auth = await authorize();

  const drive = google.drive({ version: 'v3', auth });

  const fileMetadata = {
    name: path.basename(filePath),
  };

  const media = {
    mimeType: 'application/sql',
    body: fs.createReadStream(filePath),
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id',
  });

  console.log(`✅ Backup uploaded to Google Drive with file ID: ${response.data.id}`);
}

module.exports = uploadBackup;
