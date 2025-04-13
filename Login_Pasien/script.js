// Selectors for forms, links, and wrapper
const wrapper = document.querySelector('.wrapper');
const signupLink = document.querySelector('.signup-link');
const loginLink = document.querySelector('.login-link');

// Switch to sign-up form
signupLink.onclick = () => {
    wrapper.classList.add("active");
};

// Switch to login form
loginLink.onclick = () => {
    wrapper.classList.remove("active");
};

// File input and label selectors
const fileInput = document.getElementById('identity-upload');
const customLabel = document.getElementById('file-label');
const fileNameSpan = document.querySelector('.file-name');

// Custom label click triggers file input click
customLabel.addEventListener('click', () => {
    fileInput.click();
});

// Display selected file name or reset label
fileInput.addEventListener('change', function () {
    if (fileInput.files.length > 0) {
        const fileName = fileInput.files[0].name;
        customLabel.textContent = fileName;
        fileNameSpan.textContent = fileName;
    } else {
        customLabel.textContent = 'Upload Bukti KTM/Kartu Identitas';
        fileNameSpan.textContent = 'No file chosen';
    }
});

// Handle the form submission for signup
document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const identityUpload = fileInput.files.length > 0 ? fileInput.files[0] : null;

    // Validate required fields
    if (!username || !password || !identityUpload) {
        alert("All fields are required.");
        return;
    }

    // Prepare data to send to the server
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('identityFile', identityUpload);

    // Send data to the server using fetch
    fetch('http://localhost:3001/signup', { // Corrected to port 3001
        method: 'POST',
        body: formData
    })
    .then(response => response.json()) // Parse response as JSON
    .then(data => {
        if (data.message) {
            alert(data.message); // Show server response
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred: ' + error.message);
    });
});
