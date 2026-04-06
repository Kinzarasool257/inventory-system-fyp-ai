// authServer.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const open = require('open').default;


const app = express();
const PORT = 3002;

const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

let oAuth2Client;

app.get('/', (req, res) => {
  res.send('👋 OAuth Server Running!');
});

app.get('/auth', async (req, res) => {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_secret, client_id, redirect_uris } = credentials.web;

  oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  res.redirect(authUrl);
});

// ✅ This is the important route
app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('No code found');

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Save token
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    res.send('✅ Google Drive access granted. You may close this window.');
  } catch (err) {
    console.error('❌ Error retrieving access token', err);
    res.send('❌ Error retrieving access token');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 OAuth server listening at http://localhost:${PORT}/auth`);
  open(`http://localhost:${PORT}/auth`); // Auto-open browser
});