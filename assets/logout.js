document.addEventListener("DOMContentLoaded", () => {
    const logoutLink = document.getElementById("logoutLink");

    logoutLink.addEventListener("click", (event) => {
        event.preventDefault(); // Mencegah navigasi langsung
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Anda akan keluar dari aplikasi!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Keluar',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = logoutLink.getAttribute("href");
            }
        });
    });
});