const express = require('express');
const app = express();
const port = 3007; // Ubah port default server.js menjadi 3007

app.get('/', (req, res) => {
  res.send('Server utama berjalan di port 3007');
});
const serverDokter = require('./serverdok');
const serverFeedback = require('./serverfb');
const ServerKuesioner = require('./serverku');
const ServerLogin = require('./serverlog');
const ServerPasien = require('./serverpas');
const ServerRekamMedis = require('./serverrm');

function startAllServers() {
    console.log('Memulai semua server...');
    serverDokter();
    serverFeedback();
    ServerKuesioner();
    ServerLogin();
    ServerPasien();
    ServerRekamMedis();
    console.log('Semua server sudah berjalan.');
}

startAllServers();
