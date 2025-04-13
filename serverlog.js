const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors'); // Import CORS package

const app = express();
const port = 3000;

// Enable CORS for all origins (or configure for specific origins)
app.use(cors());

// Middleware to parse JSON request body
app.use(bodyParser.json());

// Menyajikan file statis dari folder 'PULSE'
app.use(express.static(path.join(__dirname, 'PULSE')));

// Menyajikan index.html saat mengakses root atau halaman lainnya
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'PULSE/Dashboard_Admin/index.html'));
});

// Route to handle sign-up and store data in signup.json (admin)
app.post('/signup', (req, res) => {
    const { username, password, posisi } = req.body;

    // Path to signup.json file
    const signupFilePath = path.join(__dirname, 'data', 'signup.json');

    // Read existing data from signup.json
    fs.readFile(signupFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading signup data.' });
        }

        let signupData = JSON.parse(data);

        // Add the new sign-up data with pending approval status
        signupData.push({ username, password, posisi, approved: false });

        // Write updated data back to signup.json
        fs.writeFile(signupFilePath, JSON.stringify(signupData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error saving signup data.' });
            }
            // Send a JSON response with success message
            res.status(200).json({ message: 'Sign-up successful! Await approval.' });
        });
    });
});

// Sample login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Read the users from the signup.json file
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading user data.' });
        }

        let users = JSON.parse(data);
        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if the user is approved (for simplicity, we assume there's an "approved" field)
        if (!user.approved) {
            return res.status(403).json({ message: 'Account not approved yet.' });
        }

        // Successful login
        res.json({
            message: 'Login successful!',
            redirect: user.posisi === 'admin' ? '/Dashboard_Admin/index.html' : '/Dashboard_Dokter/index.html',
        });
    });
});


// Approve request endpoint
app.post('/approve-request/:username', (req, res) => {
    const username = req.params.username;
    const signupFilePath = path.join(__dirname, 'data', 'signup.json');

    // Read existing data from signup.json
    fs.readFile(signupFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading signup data.' });
        }

        let signupData = JSON.parse(data);

        // Find the request by username
        const requestIndex = signupData.findIndex(r => r.username === username);

        if (requestIndex === -1) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Update the approved status
        signupData[requestIndex].approved = true;

        // Write updated data back to signup.json
        fs.writeFile(signupFilePath, JSON.stringify(signupData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error saving updated signup data.' });
            }

            // Return success message
            res.json({ message: 'Request approved successfully!' });
        });
    });
});


// Route to get pending approval requests
app.get('/get-pending-requests', (req, res) => {
    const signupFilePath = path.join(__dirname, 'data', 'signup.json');

    // Read existing data from signup.json
    fs.readFile(signupFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading signup data.' });
        }

        let signupData = JSON.parse(data);
        const pendingRequests = signupData.filter(u => !u.approved);

        res.status(200).json(pendingRequests);
    });
});



// Route to reject a request
app.post('/reject-request/:username', (req, res) => {
    const { username } = req.params;
    const signupFilePath = path.join(__dirname, 'data', 'signup.json');

    fs.readFile(signupFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading signup data.' });
        }

        let signupData = JSON.parse(data);
        const userIndex = signupData.findIndex(u => u.username === username);

        if (userIndex !== -1) {
            signupData[userIndex].approved = false;
            signupData[userIndex].status = 'Rejected'; // Add status
            fs.writeFile(signupFilePath, JSON.stringify(signupData, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Error saving updated signup data.' });
                }
                res.status(200).json({ message: 'Request rejected successfully!' });
            });
        } else {
            res.status(404).json({ error: 'User not found.' });
        }
    });
});

// Default route
app.get('/', (req, res) => {
    res.send('ServerLogin berjalan');
});

// Start the server on the defined port
app.listen(port, () => {
    console.log(`ServerLogin berjalan di http://localhost:${port}`);
});

// Export server start function
function startServer() {
    console.log('ServerLogin ready to be started externally');
}

module.exports = startServer;
