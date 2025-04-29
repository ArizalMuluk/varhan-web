// Loading Animation
document.addEventListener('DOMContentLoaded', () => {
    // Simulate loading time
    setTimeout(() => {
        const loader = document.querySelector('.loader');
        loader.classList.add('loader-hidden');
    }, 1500); // Anda bisa sesuaikan durasi loading jika perlu
});

// Typing Animation
document.addEventListener('DOMContentLoaded', () => {
    const typedTextElement = document.getElementById('typed-text');
    // Ganti frasa ini dengan peran atau deskripsi seniman
    const phrases = [
        'Painter',              // Example
        'Visual Artist',        // Example
        'Classic Art Lover',    // Example
        'Imagination Creator'   // Example
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100; // Kecepatan mengetik awal

    function typeText() {
        // Pastikan elemen ada sebelum melanjutkan
        if (!typedTextElement) return;

        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            // Menghapus karakter
            typedTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Kecepatan menghapus
        } else {
            // Mengetik karakter
            typedTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150; // Kecepatan mengetik
        }

        // Logika pergantian status (mengetik/menghapus) dan frasa
        if (!isDeleting && charIndex === currentPhrase.length) {
            // Selesai mengetik, mulai menghapus setelah jeda
            isDeleting = true;
            typingSpeed = 1800; // Jeda di akhir frasa (sedikit lebih lama mungkin?)
        } else if (isDeleting && charIndex === 0) {
            // Selesai menghapus, ganti frasa dan mulai mengetik setelah jeda
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Jeda sebelum mengetik frasa baru
        }

        setTimeout(typeText, typingSpeed);
    }

    // Mulai animasi pengetikan setelah jeda awal (misalnya, setelah loader hilang)
    setTimeout(typeText, 2000); // Mulai setelah 2 detik
});

// --- Infinite Horizontal Scroll Gallery ---
document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.querySelector('.horizontal-scroll-gallery');
    const galleryTrack = document.querySelector('.gallery-track');

    // Pastikan elemen ada
    if (!galleryContainer || !galleryTrack) {
        console.warn("Horizontal scroll gallery elements not found.");
        return;
    }

    // 1. Duplikasi Konten
    const originalImages = galleryTrack.innerHTML;
    galleryTrack.innerHTML += originalImages; // Tambahkan duplikatnya

    let scrollPos = 0;
    const scrollSpeed = 0.5; // Sesuaikan kecepatan scroll (pixel per frame)
    let isPaused = false;
    let animationFrameId = null;

    // Hitung lebar dari set gambar asli
    // Kita perlu menunggu gambar dimuat untuk mendapatkan scrollWidth yang benar,
    // atau kita bisa mengukurnya setelah duplikasi jika semua gambar memiliki lebar/tinggi tetap.
    // Untuk amannya, kita hitung setelah duplikasi.
    const halfWidth = galleryTrack.scrollWidth / 2;

    function scrollAnimation() {
        if (!isPaused) {
            scrollPos += scrollSpeed;

            // 3. Reset Posisi untuk Loop Mulus
            if (scrollPos >= halfWidth) {
                scrollPos = 0; // Reset ke awal tanpa jeda visual
            }

            galleryTrack.style.transform = `translateX(-${scrollPos}px)`;
        }

        // Lanjutkan animasi
        animationFrameId = requestAnimationFrame(scrollAnimation);
    }

    // Jeda saat mouse hover
    galleryContainer.addEventListener('mouseenter', () => {
        isPaused = true;
    });

    galleryContainer.addEventListener('mouseleave', () => {
        isPaused = false;
        // Jika sebelumnya di-cancel, mulai lagi
        if (!animationFrameId) {
             animationFrameId = requestAnimationFrame(scrollAnimation);
        }
    });

    // Mulai animasi
    // Pastikan kita membatalkan frame sebelumnya jika ada (misalnya saat leave lalu enter lagi)
    function startAnimation() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        animationFrameId = requestAnimationFrame(scrollAnimation);
    }

    // Beri sedikit waktu agar browser menghitung ulang layout setelah duplikasi
    setTimeout(startAnimation, 100);

    // Optional: Hentikan animasi jika tab tidak aktif untuk hemat resource
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            isPaused = true; // Jeda jika tab tidak terlihat
        } else {
            // Hanya lanjutkan jika tidak sedang di-hover secara manual
            if (!galleryContainer.matches(':hover')) {
                 isPaused = false;
            }
            // Mulai lagi jika perlu
            if (!animationFrameId) {
                 startAnimation();
            }
        }
    });
});

// NEW Mobile Navigation
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const body = document.body;

    // Toggle mobile menu
    function toggleMobileMenu() {
        menuBtn.classList.toggle('active');
        mobileNavOverlay.classList.toggle('show');
        body.classList.toggle('menu-open');
    }

    // Setup event listeners
    if (menuBtn && mobileNavOverlay) {
        // Toggle menu when button is clicked
        menuBtn.addEventListener('click', toggleMobileMenu);

        // Close menu when a link is clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggleMobileMenu();
                
                // Update active link
                mobileNavLinks.forEach(navLink => {
                    navLink.classList.remove('active');
                });
                link.classList.add('active');
            });
        });

        // Close menu when clicking outside (on the overlay background)
        mobileNavOverlay.addEventListener('click', (e) => {
            // Only close if clicking the overlay itself, not its children
            if (e.target === mobileNavOverlay) {
                toggleMobileMenu();
            }
        });

        // Close menu when ESC key is pressed
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavOverlay.classList.contains('show')) {
                toggleMobileMenu();
            }
        });
    }

    // Update active link based on current section
    function updateActiveMobileLink() {
        const scrollY = window.pageYOffset;
        const sections = document.querySelectorAll('section[id]');
        
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 80;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        // Handle edge cases
        if (!currentSectionId && scrollY < sections[0].offsetTop - 80) {
            currentSectionId = sections[0].getAttribute('id');
        } else if (!currentSectionId && scrollY + window.innerHeight >= document.body.offsetHeight - 5) {
            currentSectionId = sections[sections.length - 1].getAttribute('id');
        }
        
        // Update mobile nav links
        mobileNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Initial call to set active link
    updateActiveMobileLink();
    
    // Update on scroll
    window.addEventListener('scroll', updateActiveMobileLink);
});

// Smooth Scrolling
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            // Abaikan jika hanya '#'
            if (targetId === '#') {
                e.preventDefault(); // Mencegah scroll ke atas jika hanya '#'
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll ke paling atas
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault(); // Hanya prevent default jika target ditemukan

                // Offset untuk header tetap (sesuaikan jika tinggi header berubah)
                const offset = 70; // Mungkin perlu disesuaikan sedikit (misal: 70 atau 75)
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = targetElement.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
            // Jika targetElement tidak ditemukan, biarkan browser menangani link (mungkin link eksternal)
        });
    });
});


// Active Navigation Link (Scrollspy)
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section[id]'); // Hanya pilih section yang punya ID
    const navLinks = document.querySelectorAll('.nav-link'); // Link navigasi desktop

    function updateActiveLink() {
        let currentSectionId = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 80; // Offset sedikit lebih besar dari header
            const sectionHeight = section.clientHeight;

            // Tentukan section mana yang sedang terlihat di viewport
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Jika tidak ada section yang pas, mungkin di paling atas atau paling bawah
        if (!currentSectionId && scrollY < sections[0].offsetTop - 80) {
             currentSectionId = sections[0].getAttribute('id'); // Aktifkan link pertama jika di atas section pertama
        } else if (!currentSectionId && scrollY + window.innerHeight >= document.body.offsetHeight - 5) {
             currentSectionId = sections[sections.length - 1].getAttribute('id'); // Aktifkan link terakhir jika di paling bawah
        }


        // Update link desktop
        navLinks.forEach(link => {
            link.classList.remove('active'); // Kelas 'active' dihandle oleh CSS baru
            // Periksa apakah href cocok (setelah menghapus '#')
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Panggil sekali saat load untuk set state awal
});


// Fade-in Animation on Scroll
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in'); // <-- Memilih semua elemen dengan kelas .fade-in

    // Pastikan IntersectionObserver didukung
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // Jika elemen masuk ke viewport (sesuai threshold)
                if (entry.isIntersecting) {
                    // Tambahkan kelas 'appear' untuk memicu transisi CSS
                    entry.target.classList.add('appear');
                    // Hentikan observasi elemen ini agar animasi tidak berulang
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 // Muncul saat 10% elemen terlihat
        });

        // Mulai mengamati setiap elemen .fade-in
        fadeElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback jika IntersectionObserver tidak didukung
        fadeElements.forEach(element => {
            element.classList.add('appear');
        });
    }
});



// Back to Top Button
document.addEventListener('DOMContentLoaded', () => {
    const backToTopBtn = document.getElementById('backToTop');

    if (!backToTopBtn) return;

    function toggleBackToTopButton() {
        if (window.pageYOffset > 300) { // Tampilkan setelah scroll 300px
            // Gunakan kelas untuk kontrol yang lebih baik via CSS
            backToTopBtn.classList.add('show-back-to-top');
        } else {
            backToTopBtn.classList.remove('show-back-to-top');
        }
    }

    window.addEventListener('scroll', toggleBackToTopButton);
    toggleBackToTopButton(); // Cek kondisi awal saat load

    // Smooth scroll ke atas saat diklik
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Form Validation (Simple)
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('#contact form'); // Lebih spesifik

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Selalu cegah submit default

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            const submitBtn = contactForm.querySelector('button[type="submit"]');

            let isValid = true;

            // Fungsi validasi email sederhana
            function isValidEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }

            // Fungsi untuk highlight error (menggunakan kelas CSS baru jika perlu)
            function highlightError(input) {
                // Gunakan kelas error yang didefinisikan di CSS Anda
                input.classList.add('border-red-500'); // Contoh: border merah
                // Anda bisa menambahkan kelas lain jika perlu
            }

            // Fungsi untuk reset highlight
            function resetHighlight(input) {
                input.classList.remove('border-red-500');
                // Hapus kelas error lain jika ada
            }

            // Validasi Input
            [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
                resetHighlight(input); // Reset dulu
                if (!input.value.trim()) {
                    highlightError(input);
                    isValid = false;
                }
            });

            // Validasi Email spesifik
            if (emailInput.value.trim() && !isValidEmail(emailInput.value)) {
                highlightError(emailInput);
                isValid = false;
            }

            if (isValid) {
                // Jika valid, lanjutkan dengan simulasi pengiriman
                const originalText = submitBtn.innerHTML; // Simpan HTML asli (termasuk ikon)

                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin ml-2"></i>'; // Tambahkan ikon loading

                // Hapus simulasi timeout jika menggunakan fetch di atas
                 setTimeout(() => {
                     submitBtn.innerHTML = 'Message Sent! <i class="fas fa-check ml-2"></i>';
                     // Tambahkan kelas untuk styling sukses jika perlu (misal: background hijau)
                     // submitBtn.classList.add('bg-green-600', 'hover:bg-green-700');
                     // submitBtn.classList.remove('bg-gradient-custom'); // Hapus gradient jika ada

                     contactForm.reset(); // Reset form

                     // Kembalikan tombol setelah beberapa detik
                     setTimeout(() => {
                         submitBtn.innerHTML = originalText;
                         submitBtn.disabled = false;
                         // Hapus kelas sukses
                         // submitBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
                         // submitBtn.classList.add('bg-gradient-custom'); // Kembalikan gradient jika perlu
                     }, 4000); // Durasi pesan sukses tampil
                 }, 1500); // Simulasi waktu pengiriman
                // Akhir dari blok simulasi

            } else {
                // Jika tidak valid, jangan lakukan apa-apa (error sudah ditandai)
                console.log("Form validation failed.");
            }
        });
    }
});


// Optional: Performance Optimizations (Lazy Loading Images)
document.addEventListener('DOMContentLoaded', () => {
    // Hanya jalankan jika IntersectionObserver didukung
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]'); // Targetkan gambar dengan atribut data-src

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');

                    img.setAttribute('src', src);
                    img.removeAttribute('data-src'); // Hapus atribut setelah dimuat

                    // Optional: Tambahkan kelas saat gambar selesai dimuat (untuk animasi fade-in gambar)
                    img.onload = () => {
                        img.classList.add('loaded');
                    };

                    observer.unobserve(img); // Hentikan observasi
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback: Muat semua gambar secara langsung jika IO tidak didukung
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            const src = img.getAttribute('data-src');
            img.setAttribute('src', src);
            img.removeAttribute('data-src');
        });
    }
});