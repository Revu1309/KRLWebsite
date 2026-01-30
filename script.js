/**
 * KRL Transport & Contracting Est
 * Corporate Website - Ultra-Premium Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Custom Reactive Cursor ---
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    // Check if device supports hover
    if (window.matchMedia("(hover: hover)").matches) {
        cursor.style.display = 'block';

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Hover states
        const interactables = document.querySelectorAll('a, button, .service-card, .project-item, .bento-item');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });
    }

    // --- Inertial Scroll Simulation (Lenis-like) ---
    const scrollContainer = document.body;
    let targetScroll = 0;
    let currentScroll = 0;
    const ease = 0.075; // Smoothness factor

    function lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
    }

    // We only simulate on non-mobile for better performance control
    if (window.innerWidth > 1024) {
        window.addEventListener('wheel', (e) => {
            e.preventDefault();
            targetScroll += e.deltaY;
            targetScroll = Math.max(0, Math.min(targetScroll, document.documentElement.scrollHeight - window.innerHeight));
        }, { passive: false });

        function updateScroll() {
            currentScroll = lerp(currentScroll, targetScroll, ease);
            window.scrollTo(0, currentScroll);
            requestAnimationFrame(updateScroll);
        }
        requestAnimationFrame(updateScroll);
    }

    // --- Magnetic Buttons ---
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });

    // --- Kinetic Reveal logic (Enhanced IO) ---
    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const premiumObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('ultra-active');
                // Special stagger for bento items
                if (entry.target.classList.contains('bento-grid')) {
                    entry.target.querySelectorAll('.bento-item').forEach((item, i) => {
                        setTimeout(() => item.classList.add('active'), i * 100);
                    });
                }
                premiumObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    document.querySelectorAll('.section-title, .bento-grid, .service-card, .about-visual').forEach(el => {
        premiumObserver.observe(el);
    });

    // --- Hero Image Sequence Player ---
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const frameCount = 80;
        const currentFrame = index => `hero/hero_${index.toString().padStart(3, '0')}.jpg`;

        const images = [];
        const sequence = { frame: 0 };

        // Preload images
        let loadedCount = 0;
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            img.onload = () => {
                loadedCount++;
                if (loadedCount === frameCount) {
                    canvas.classList.add('loaded');
                    render(0);
                }
            };
            images.push(img);
        }

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            render(0); // Initial render on resize
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        function render(frame) {
            const index = Math.min(frameCount - 1, Math.max(0, frame));
            if (images[index] && images[index].complete) {
                const img = images[index];
                const canvasAspect = canvas.width / canvas.height;
                const imgAspect = img.width / img.height;

                let drawWidth, drawHeight, offsetX, offsetY;

                if (canvasAspect > imgAspect) {
                    drawWidth = canvas.width;
                    drawHeight = canvas.width / imgAspect;
                    offsetX = 0;
                    offsetY = (canvas.height - drawHeight) / 2;
                } else {
                    drawWidth = canvas.height * imgAspect;
                    drawHeight = canvas.height;
                    offsetX = (canvas.width - drawWidth) / 2;
                    offsetY = 0;
                }

                const zoomFactor = 1.05; // 5% zoom to hide watermark/edges
                drawWidth *= zoomFactor;
                drawHeight *= zoomFactor;
                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = (canvas.height - drawHeight) / 2;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            }
        }

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const maxScroll = window.innerHeight; // Animation plays over the first viewport height
            const scrollFraction = Math.min(1, scrollTop / maxScroll);
            const frameIndex = Math.floor(scrollFraction * (frameCount - 1));

            requestAnimationFrame(() => render(frameIndex));
        });
    }

    // --- Hero Parallax (Optimized) ---
    const heroMedia = document.getElementById('heroParallax');
    if (heroMedia) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            heroMedia.style.transform = `translateY(${scrolled * 0.4}px) scale(${1 + scrolled * 0.0005})`;
        });
    }

    // --- Header Scroll State ---
    const siteHeader = document.getElementById('siteHeader');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu ---
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('nav-active');
            menuToggle.classList.toggle('is-active');
        });
    }
});
