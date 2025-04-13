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

      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value.trim();

      if (!username || !password) {
        Swal.fire({
          icon: 'warning',
          title: 'Perhatian!',
          text: 'Silakan masukkan username dan password.',
        });
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: data.message,
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            window.location.href = data.redirect || 'PULSE/Dashboard_Admin/index.html';
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: data.message || 'Login gagal.',
          });
        }
      } catch (error) {
        console.error('Error during login:', error);
        Swal.fire({
          icon: 'error',
          title: 'Kesalahan!',
          text: 'Terjadi kesalahan selama proses login. Silakan coba lagi.',
        });
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
        Swal.fire({
          icon: 'warning',
          title: 'Perhatian!',
          text: 'Semua field harus diisi.',
        });
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, posisi, identity }),
        });

        const data = await response.json();

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Pendaftaran Berhasil!',
            text: data.message || 'Anda berhasil mendaftar.',
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            wrapper.classList.remove("active"); // Kembali ke form login
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: data.message || 'Pendaftaran gagal.',
          });
        }
      } catch (error) {
        console.error('Error during sign-up:', error);
        Swal.fire({
          icon: 'error',
          title: 'Kesalahan!',
          text: 'Terjadi kesalahan selama proses pendaftaran.',
        });
      }
    });
  }
});
