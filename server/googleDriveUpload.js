const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

async function authorize() {
  console.log('🔐 Starting OAuth process...');

  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error(' credentials.json file not found.');
  }

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_secret, client_id, redirect_uris } = credentials.web;

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  if (fs.existsSync(TOKEN_PATH)) {
    console.log('✅ Token exists, loading...');
    const token = fs.readFileSync(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
  }

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('\n🔗 Authorize this app by visiting the URL:\n');
  console.log(authUrl);
  console.log('\n❗ After approving access, paste the code into the script.\n');

  return null; // You'll handle the authorization code manually
}

async function uploadBackup(filePath) {
  const auth = await authorize();
  if (!auth) {
    console.log(' OAuth not complete. Complete the authorization step to proceed.');
    return;
  }

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

// If you run this file directly, start the OAuth flow
(async () => {
  try {
    await authorize();
  } catch (err) {
    console.error('❌ Authorization failed:', err);
  }
})();

module.exports = uploadBackup;