const express = require('express');
const path = require('path');

const app = express();
const PORT = 3004;

// Middleware untuk melayani file statis
app.use(express.static(path.join(__dirname, 'Dokter_Admin')));
app.use('/data', express.static(path.join(__dirname, 'Rekam Medis_Pasien')));

// Endpoint untuk file JSON
app.get('/feedback', (req, res) => {
    res.sendFile(path.join(__dirname, 'data', 'feedback.json'));
});

// Default route
app.get('/', (req, res) => {
    res.send('ServerFeedback berjalan');
  });
  
  // Start the server on the defined PORT
  app.listen(PORT, () => {
    console.log(`ServerFeedback berjalan di http://localhost:${PORT}`);
  });
  
  // Export server start function
  function startServer() {
    console.log('ServerFeedback ready to be started externally');
  }
  
  module.exports = startServer;