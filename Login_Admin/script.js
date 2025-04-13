// Login form submission logic
console.log('Script loaded'); // Tambahkan ini di awal script.js
document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.wrapper');
  const signuplink = document.querySelector('.signup-link');
  const loginlink = document.querySelector('.login-link');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  // Handle signup link click
  if (signuplink) {
    signuplink.addEventListener('click', () => {
      wrapper.classList.add("active");
    });
  }

  // Handle login link click
  if (loginlink) {
    loginlink.addEventListener('click', () => {
      wrapper.classList.remove("active");
    });
  }

// Login form submission logic
if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent page reload'
    console.log('Login form submitted'); // Debug

    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!username || !password) {
      alert('Please enter your username and password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log(data); // Debug: periksa respons

      if (response.ok) {
        alert(data.message); // Display success message
        window.location.href = data.redirect || 'PULSE/Dashboard_Admin/index.html'; // Redirect to Dashboard_Admin
      } else {
        alert(data.message || 'Login failed.'); // Display failure message
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login.');
    }
  });
}

  // Signup form submission logic
  if (signupForm) {
    signupForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const username = document.getElementById('signup-username').value.trim();
      const password = document.getElementById('signup-password').value.trim();
      const posisi = document.getElementById('signup-posisi').value;
      const identity = document.getElementById('signup-identity').value;

      if (!username || !password || !posisi || !identity) {
        alert('Please fill in all fields.');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, posisi, identity }),
        });

        const data = await response.json();

        alert(data.message || 'Sign-up failed.');
      } catch (error) {
        console.error('Error during sign-up:', error);
        alert('An error occurred during sign-up.');
      }
    });
  }
});
