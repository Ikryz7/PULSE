const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Import CORS
const fs = require('fs');
const path = require('path');
const multer = require('multer');  // To handle file uploads

const app = express();
const port = 3008;
app.use(cors());


// Path menuju file rm.json
const dataPath = path.join(__dirname, 'data', 'rm.json');

// Endpoint to get patient data based on 'nomor_rekam_medis'
app.get('/api/pasien-umum', (req, res) => {
    // Membaca file JSON
    fs.readFile(path.join(__dirname, 'data', 'rm.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading data' });
        }

        const pasienData = JSON.parse(data);

        if (!pasienData) {
            return res.status(400).json({ message: 'No data found in rm.json' });
        }

        // Menyaring pasien dengan poli Umum
        const pasienUmum = pasienData.filter(pasien => pasien.penanganan.poli === 'Poli Umum');

        // Debugging: Log the filtered data
        console.log('Filtered Pasien Umum:', pasienUmum);

        if (pasienUmum.length === 0) {
            return res.status(404).json({ message: 'No Pasien found for Poli Umum' });
        }

        // Mengirim data pasien poli umum ke frontend
        res.json(pasienUmum);
    });
});

// Endpoint untuk mengambil data pasien poli gigi
app.get('/api/pasien-gigi', (req, res) => {
    // Membaca file JSON
    fs.readFile(path.join(__dirname, 'data', 'rm.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading data' });
        }

        // Mengonversi data JSON
        const pasienData = JSON.parse(data);

        // Menyaring pasien dengan poli Gigi
        const pasienGigi = pasienData.filter(pasien => pasien.penanganan.poli === 'Poli Gigi');

        // Mengirim data pasien poli gigi ke frontend
        res.json(pasienGigi);
    });
});

// Default route
app.get('/', (req, res) => {
    res.send('ServerRekamMedis berjalan');
  });
  
  // Start the server on the defined port
  app.listen(port, () => {
    console.log(`ServerRekamMedis berjalan di http://localhost:${port}`);
  });
  
  // Export server start function
  function startServer() {
    console.log('ServerRekamMedis ready to be started externally');
  }
  
  module.exports = startServer;
