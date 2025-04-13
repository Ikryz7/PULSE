const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');  // Import CORS to allow cross-origin requests
const app = express();
const port = 3006;
const multer = require('multer');


// Use CORS middleware to allow cross-origin requests
app.use(cors());
app.use(express.json());

// Middleware to allow static file access (like HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'Jadwal_Dokter Umum')));
app.use(express.static(path.join(__dirname, 'Jadwal_Dokter Gigi')));

// Route for 'Jadwal Dokter Umum' (General doctor schedule)
app.get('/jadwal-dokter-umum', (req, res) => {
  fs.readFile(path.join(__dirname, 'data', 'kuesioner.json'), 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading kuesioner.json');
      return;
    }

    const kuesionerData = JSON.parse(data);

    // Filter data untuk "Poli Umum"
    const filteredData = kuesionerData.filter(item => item.identitas.poliPeriksa === "Poli Umum");

    res.json(filteredData);  // Kembalikan data sebagai JSON
  });
});

app.get('/jadwal-dokter-gigi', (req, res) => {
  fs.readFile(path.join(__dirname, 'data', 'kuesioner.json'), 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading kuesioner.json');
      return;
    }

    const kuesionerData = JSON.parse(data);

    // Filter data untuk "Poli Gigi"
    const filteredData = kuesionerData.filter(item => item.identitas.poliPeriksa === "Poli Gigi");

    res.json(filteredData);  // Kembalikan data sebagai JSON
  });
});


app.post('/update-jadwal', (req, res) => {
  const { id, status } = req.body;

  if (!id || !status) {
    return res.status(400).send('ID dan status wajib diisi');
  }

  fs.readFile(path.join(__dirname, 'data', 'kuesioner.json'), 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading file');
      return;
    }

    const kuesionerData = JSON.parse(data);
    const itemToUpdate = kuesionerData.find(item => item.identitas.id === id);

    if (itemToUpdate) {
      itemToUpdate.konfirmasiJadwal = status;

      fs.writeFile(path.join(__dirname, 'data', 'kuesioner.json'), JSON.stringify(kuesionerData, null, 2), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error updating file');
        } else {
          res.status(200).json({
            message: 'Jadwal updated successfully',
            updatedItem: itemToUpdate
          });
        }
      });
    } else {
      res.status(404).send('Item not found');
    }
  });
});

const dataPath = path.join(__dirname, 'data', 'datadokter.json');

// Endpoint untuk menangani POST ke /add-dokter
app.post('/add-dokter', (req, res) => {
  const newData = req.body;

  // Path ke file datadokter.json
  const dataPath = path.join(__dirname, 'data', 'datadokter.json');

  // Baca data yang ada
  fs.readFile(dataPath, 'utf8', (err, data) => {
      if (err) {
          console.error('Gagal membaca file:', err);
          res.status(500).json({ message: 'Gagal membaca data dokter.' });
          return;
      }

      let dokterList = [];
      try {
          dokterList = JSON.parse(data);
      } catch (parseErr) {
          console.error('Gagal parse data:', parseErr);
          res.status(500).json({ message: 'Format data tidak valid.' });
          return;
      }

      // Tambahkan data baru
      dokterList.push(newData);

      // Tulis kembali data ke file
      fs.writeFile(dataPath, JSON.stringify(dokterList, null, 2), 'utf8', (writeErr) => {
          if (writeErr) {
              console.error('Gagal menulis file:', writeErr);
              res.status(500).json({ message: 'Gagal menyimpan data dokter.' });
              return;
          }

          res.status(200).json({ message: 'Data dokter berhasil ditambahkan.' });
      });
  });
});

app.post('/update-dokter', (req, res) => {
  const { namaDokter, updatedData } = req.body;

  console.log(`Menerima request untuk memperbarui dokter dengan nama: ${namaDokter}`);
  
  fs.readFile(dataPath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error membaca datadokter.json:', err);
      res.status(500).send('Error membaca datadokter.json');
      return;
    }

    let dokterList = JSON.parse(data);

    console.log(`Data sebelum update: ${JSON.stringify(dokterList)}`);

    const index = dokterList.findIndex(dokter => dokter.namaDokter === namaDokter);

    if (index !== -1) {
      dokterList[index] = { ...dokterList[index], ...updatedData };

      console.log(`Data setelah update: ${JSON.stringify(dokterList[index])}`);

      fs.writeFile(dataPath, JSON.stringify(dokterList, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
          console.error('Error menulis file:', writeErr);
          res.status(500).send('Error memperbarui data dokter');
        } else {
          res.status(200).send('Data dokter berhasil diperbarui');
        }
      });
    } else {
      console.log(`Dokter dengan nama ${namaDokter} tidak ditemukan`);
      res.status(404).send('Dokter tidak ditemukan');
    }
  });
});

// Direktori untuk menyimpan file temporer gambar
// Setup for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Folder tujuan penyimpanan file
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// POST route for handling image uploads
app.post('/upload', upload.single('image'), (req, res) => {
    const { nama, jabatan } = req.body;
    const imagePath = req.file ? req.file.path : null;

    // Assuming there is a JSON file presensi.json to save the data
    fs.readFile(path.join(__dirname, 'data', 'presensi.json'), (err, data) => {
        if (err) throw err;
        let presensi = JSON.parse(data);

        presensi.push({
            nama: nama,
            jabatan: jabatan,
            gambar: imagePath
        });
        console.log('Uploaded file path:', req.file ? req.file.path : 'No file uploaded');
        res.status(200).send('File uploaded successfully!');
        fs.writeFile(path.join(__dirname, 'data', 'presensi.json'), JSON.stringify(presensi, null, 2), (err) => {
            if (err) throw err;
            res.json({ message: 'Presensi berhasil disimpan!', data: presensi });
        });
    });
});

// Start the server on the defined port
app.listen(port, () => {
  console.log(`ServerDokter berjalan di http://localhost:${port}`);
});

// Export server start function
function startServer() {
  console.log('ServerDokter ready to be started externally');
}

module.exports = startServer;