const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const app = express();
const port = 3001;

// Enable CORS for all origins (configure for specific origins if needed)
app.use(cors({
    origin: 'http://localhost:3001', // Ensure this matches the client URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Middleware to parse JSON request body
app.use(bodyParser.json());

// Middleware for file uploads
app.use(fileUpload());

// Serve static files from the 'PULSE' directory and its subdirectories
app.use(express.static(path.join(__dirname, 'PULSE')));
app.use('/Login_Pasien', express.static(path.join(__dirname, 'Login_Pasien')));
app.use('/Dashboard_Pasien', express.static(path.join(__dirname, 'Dashboard_Pasien')));
app.use('/Pendaftaran_Pasien', express.static(path.join(__dirname, 'Pendaftaran_Pasien')));
app.use('/Rekam_Medis_Pasien', express.static(path.join(__dirname, 'Rekam_Medis_Pasien')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Path to sign-up data file
const signUpFilePath = path.join(__dirname, 'data', 'signuppat.json');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Login_Pasien/index.html'));
});

// Route to handle sign-up
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const file = req.files?.identityFile;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    fs.readFile(signUpFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading sign-up data.' });
        }

        const signupData = JSON.parse(data || '[]');
        const userExists = signupData.some(user => user.username === username);

        if (userExists) {
            return res.status(400).json({ message: 'Username already exists.' });
        }

        const newUser = {
            username,
            password,
            posisi: "Pasien",
            approved: true,
            status: "Active",
            identityFile: file ? `${username}_${file.name}` : null
        };

        // Save uploaded file if present
        if (file) {
            const uploadPath = path.join(uploadsDir, `${username}_${file.name}`);
            file.mv(uploadPath, (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Error saving identity file.' });
                }
            });
        }

        signupData.push(newUser);

        fs.writeFile(signUpFilePath, JSON.stringify(signupData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error saving sign-up data.' });
            }
            res.status(200).json({ message: 'Sign-up successful!' });
        });
    });
});

// Route to handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    fs.readFile(signUpFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading user data.' });
        }

        let users = JSON.parse(data || '[]');
        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        if (!user.approved) {
            return res.status(403).json({ message: 'Account not approved yet.' });
        }

        res.status(200).json({
            message: 'Login successful!',
            redirect: '/Dashboard_Pasien/index.html' // Redirect to the patient dashboard
        });
    });
});

// Route to approve user request
app.post('/approve-request/:username', (req, res) => {
    const { username } = req.params;

    fs.readFile(signUpFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading sign-up data.' });
        }

        let users = JSON.parse(data || '[]');
        const user = users.find(u => u.username === username);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.approved = true;

        fs.writeFile(signUpFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error saving updated user data.' });
            }
            res.status(200).json({ message: 'User approved successfully!' });
        });
    });
});

// Route to reject user request
app.post('/reject-request/:username', (req, res) => {
    const { username } = req.params;

    fs.readFile(signUpFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading sign-up data.' });
        }

        let users = JSON.parse(data || '[]');
        const user = users.find(u => u.username === username);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.approved = false;
        user.status = 'Rejected';

        fs.writeFile(signUpFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error saving updated user data.' });
            }
            res.status(200).json({ message: 'User rejected successfully!' });
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`ServerLoginPasien berjalan di http://localhost:${port}`);
});