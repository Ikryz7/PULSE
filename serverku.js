const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3003;
const { v4: uuidv4 } = require('uuid'); // Pastikan menginstal uuid library

app.use(cors());
app.use(express.json());

// Middleware untuk melayani file statis
app.use(express.static(path.join(__dirname, 'Pasien_Admin')));
app.use('/data', express.static(path.join(__dirname, 'data')));

// Endpoint untuk menyimpan data identitas dan kuesioner dalam satu array
app.post('/submit-identitas', (req, res) => {
    const identitasData = req.body; // Data identitas dari form Data Diri
    const filePath = path.join(__dirname, 'data', 'kuesioner.json');

    // Generate ID unik untuk setiap submission
    const uniqueId = uuidv4();
    identitasData.id = uniqueId;

    // Cek apakah file ada, jika tidak buat file baru
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }

    // Baca data dari kuesioner.json
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Gagal membaca file:', err);
            return res.status(500).json({ message: 'Error reading file' });
        }

        let jsonData = [];
        if (data) {
            try {
                jsonData = JSON.parse(data);
            } catch (parseErr) {
                console.error('Gagal parsing file JSON:', parseErr);
                return res.status(500).json({ message: 'Error parsing JSON' });
            }
        }

        // Tambahkan data identitas dengan ID unik
        jsonData.push({ identitas: identitasData, kuesioner: null });

        // Simpan data ke file JSON
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Gagal menyimpan file:', writeErr);
                return res.status(500).json({ message: 'Error saving data' });
            }

            res.status(200).json({ message: 'Data identitas berhasil disimpan', id: uniqueId });
        });
    });
});


// Endpoint untuk menyimpan data kuesioner
app.post('/submit-kuesioner', (req, res) => {
    const kuesionerData = req.body; // Data dari form kuesioner
    const filePath = path.join(__dirname, 'data', 'kuesioner.json');

    // Cek jika file tidak ada, buat file baru
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }

    // Baca data dari kuesioner.json
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Gagal membaca file:', err);
            return res.status(500).json({ message: 'Error reading file' });
        }

        let jsonData = [];
        if (data) {
            try {
                jsonData = JSON.parse(data); // Parsing file JSON jika tidak kosong
            } catch (parseErr) {
                console.error('Gagal parsing file JSON:', parseErr);
                return res.status(500).json({ message: 'Error parsing JSON' });
            }
        }

        // Cari entry terakhir yang sudah ada dalam array dan tambahkan data kuesioner
        const lastEntry = jsonData[jsonData.length - 1];
        if (lastEntry) {
            // Menambahkan data kuesioner tanpa menambahkan selectedSchedule=null
            lastEntry.kuesioner = kuesionerData;
        } else {
            return res.status(400).json({ message: 'Data identitas belum ada, pastikan identitas sudah disubmit' });
        }

        // Simpan data ke file JSON
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Gagal menyimpan file:', writeErr);
                return res.status(500).json({ message: 'Error saving data' });
            }

            res.status(200).json({ message: 'Kuesioner berhasil disimpan' });
        });
    });
});
// Endpoint untuk membaca data JSON
app.get("/data/kuesioner", (req, res) => {
    const filePath = path.join(__dirname, "data", "kuesioner.json");
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            res.status(500).send({ error: "Gagal membaca file JSON" });
        } else {
            res.send(JSON.parse(data));
        }
    });
});

// Endpoint untuk memperbarui jadwal dalam file kuesioner.json
app.post('/submit-schedule', (req, res) => {
    const { id, selectedSchedule } = req.body;

    if (!id || !selectedSchedule) {
        return res.status(400).json({ message: 'Missing id or selectedSchedule' });
    }

    const filePath = path.join(__dirname, 'data', 'kuesioner.json');

    // Baca file JSON
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ message: 'Error reading file' });
        }

        let jsonData = [];
        if (data) {
            try {
                jsonData = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing JSON:', parseErr);
                return res.status(500).json({ message: 'Error parsing JSON' });
            }
        }

        // Cari entry berdasarkan id dan update selectedSchedule
        const entryToUpdate = jsonData.find(entry => entry.identitas && entry.identitas.id === id);
        if (entryToUpdate) {
            entryToUpdate.selectedSchedule = selectedSchedule; // Tambahkan atau perbarui selectedSchedule
        } else {
            return res.status(404).json({ message: 'Entry not found' });
        }

        // Simpan perubahan ke file JSON
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error saving file:', writeErr);
                return res.status(500).json({ message: 'Error saving data' });
            }

            res.status(200).json({ message: 'Schedule updated successfully' });
        });
    });
});

// Default route
app.get('/', (req, res) => {
    res.send('ServerKuesioner berjalan');
  });
  
  // Start the server on the defined PORT
  app.listen(PORT, () => {
    console.log(`ServerKuesioner berjalan di http://localhost:${PORT}`);
  });
  
  // Export server start function
  function startServer() {
    console.log('ServerKuesioner ready to be started externally');
  }
  
  module.exports = startServer;