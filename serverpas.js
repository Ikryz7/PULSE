const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();

const PORT = 3010;
// Daftar beberapa kota di Indonesia
const cities = ["Bandung", "Jakarta", "Surabaya", "Yogyakarta", "Medan", "Makassar", "Denpasar"];

// Fungsi untuk menghasilkan ID random 10 digit
function generateRandomId() {
  return Math.random().toString().slice(2, 12); // Menghasilkan 10 angka acak
}

// Fungsi untuk menghasilkan alamat acak (huruf)
function generateRandomAddress() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let address = '';
  for (let i = 0; i < 10; i++) {
    address += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return address;
}

// Fungsi untuk memilih jenis kelamin secara acak
function generateRandomGender() {
  return Math.random() > 0.5 ? 'perempuan' : 'laki-laki';
}

// Use CORS to allow cross-origin requests
app.use(cors());
// Serve static files from the root folder and Rekam Medis_Dokter Umum
app.use(express.static(path.join(__dirname)));
app.use('/Rekam Medis_Dokter Umum', express.static(path.join(__dirname, 'Rekam Medis_Dokter Umum')));


// Serve the kuesioner.json file from the correct folder
app.get('/data/kuesioner.json', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'kuesioner.json');  // Perbaiki jalur ke 'data/kuesioner.json'
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read kuesioner.json' });
    }
    res.json(JSON.parse(data));
  });
});

// Serve the kuesioner.json file from the correct folder
app.get('/data/kuesioner.json', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'kuesioner.json');  // Perbaiki jalur ke 'data/kuesioner.json'
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read kuesioner.json' });
    }

    // Parsing the JSON file
    let jsonData = JSON.parse(data);

    // Jika ada data yang tidak lengkap, diisi dengan random
    const identitas = jsonData.identitas;

    // Randomisasi data jika kosong
    const updatedIdentitas = {
      nama: identitas.nama || `Nama ${Math.random().toString(36).substring(2, 8)}`,
      tanggalPeriksa: identitas.tanggalPeriksa || "2025-01-12",
      waktuMulai: identitas.waktuMulai || "10:55",
      waktuSelesai: identitas.waktuSelesai || "11:57",
      poliPeriksa: identitas.poliPeriksa || "Poli Umum",
      id: identitas.id || generateRandomId(),
      alamat: identitas.alamat || generateRandomAddress(),
      tempat_lahir: identitas.tempat_lahir || cities[Math.floor(Math.random() * cities.length)],
      jenis_kelamin: identitas.jenis_kelamin || generateRandomGender()
    };

    // Update data identitas
    jsonData.identitas = updatedIdentitas;

    // Kirim response JSON yang sudah diperbarui
    res.json(jsonData);
  });
});
app.post('/update-kuesioner', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'kuesioner.json');

  const newData = req.body;  // The data sent in the POST request

  if (!newData) {
    return res.status(400).json({ error: 'No data received in the request body' });
  }

  // Reading the existing kuesioner.json file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read kuesioner.json' });
    }

    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (e) {
      return res.status(500).json({ error: 'Error parsing kuesioner.json' });
    }

    // Adding new data to the existing structure
    jsonData.kuesioner = jsonData.kuesioner || {};
    jsonData.kuesioner.details = jsonData.kuesioner.details || {};
    jsonData.kuesioner.details.dataKlinis = jsonData.kuesioner.details.dataKlinis || [];
    jsonData.kuesioner.details.dataKlinis.push(newData);

    // Saving the updated data back to the JSON file
    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to write to kuesioner.json' });
      }
      res.status(200).json({ message: 'Data updated successfully' });
    });
  });
});


// Default route
app.get('/', (req, res) => {
  res.send('ServerPasien berjalan');
});

// Start the server on the defined PORT
app.listen(PORT, () => {
  console.log(`ServerPasien berjalan di http://localhost:${PORT}`);
});

// Export server start function
function startServer() {
  console.log('ServerPasien ready to be started externally');
}

module.exports = startServer;
