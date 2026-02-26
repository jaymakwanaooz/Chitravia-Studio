const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Burger Animation
        burger.classList.toggle('toggle');
    });
}

const scrollActive = () => {
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    const sections = document.querySelectorAll('section');
    const options = {
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                // Add class to animate elements inside section if needed
                entry.target.classList.add('visible');
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });
}

// Burger Toggle Animation Class via JS if not in CSS
document.head.insertAdjacentHTML("beforeend", `<style>
.toggle .line1 {
    transform: rotate(-45deg) translate(-5px, 6px);
}
.toggle .line2 {
    opacity: 0;
}
.toggle .line3 {
    transform: rotate(45deg) translate(-5px, -6px);
}
</style>`)



const handlePreloader = () => {
    const preloader = document.getElementById('preloader');
    if (!preloader) return; // Guard clause
    const body = document.body;

    // Force scroll to top on refresh
    window.scrollTo(0, 0);

    // Prevent browser from trying to restore scroll position
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // Clear the hash from URL so it doesn't jump back
    if (window.location.hash) {
        window.location.hash = ''; // Force clear hash immediately
        history.replaceState(null, null, window.location.pathname);
    }

    // Double check scroll position after a tiny delay
    setTimeout(() => window.scrollTo(0, 0), 10);

    // Add loading class to body
    body.classList.add('loading');

    // Wait for animation to finish (approx 2.5s total: 2s animation + fade out buffer)
    setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        body.classList.remove('loading');

        // Remove from DOM after fade out
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 2500); // 2.5s total duration
}

const initAmbientScroll = () => {
    // Parallax effect for orbs
    const orbs = document.querySelectorAll('.light-orb');

    // Disable parallax on mobile/tablet to save processing
    if (window.innerWidth <= 768) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                orbs.forEach((orb, index) => {
                    const speed = (index % 3 + 1) * 0.1; // varied speeds
                    // Move orbs slightly opposite to scroll for depth
                    orb.style.transform = `translate3d(0, ${scrolled * speed * 0.2}px, 0)`; // Use 3d for GPU
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true }); // Passive listener

    // Initial position update
    const scrolled = window.scrollY;
    orbs.forEach((orb, index) => {
        const speed = (index % 3 + 1) * 0.1;
        orb.style.transform = `translate3d(0, ${scrolled * speed * 0.2}px, 0)`;
    });
}

const app = () => {
    initAmbientScroll();
    handlePreloader();
    navSlide();
    scrollActive();
    fetchFeaturedProjects();
    setRandomHeroBackground();
}

app();

// --- Random Hero Background & Theme Color ---
// --- Random Hero Background & Theme Color ---
function setRandomHeroBackground() {
    const heroBg = document.querySelector('.hero-bg');
    if (!heroBg) return;

    // Use global THEMES from config.js (loaded in head)
    if (typeof THEMES === 'undefined') {
        console.error('THEMES not defined in config.js');
        return;
    }

    // Detect Page Type
    const path = window.location.pathname;
    // Simple check: if path ends with .html but NOT index.html, it's an internal page.
    // Or if it contains 'projects' or 'admin'.
    const isInternalPage = path.includes('projects.html') || path.includes('admin.html');

    let themeIndex;

    if (!isInternalPage) {
        // Home Page: Always random - BUT only if we haven't already set it for this "session/load"? 
        // No, user requirement: "Make home page background random everytime"
        themeIndex = Math.floor(Math.random() * THEMES.length);
        sessionStorage.setItem('chitravia_theme_index', themeIndex);

        // Ensure animation is ON for home
        heroBg.classList.remove('static-bg');
    } else {
        // Internal Page: Load stored, fallback to random
        let storedIndex = sessionStorage.getItem('chitravia_theme_index');

        // Validate storedIndex range
        if (storedIndex === null || isNaN(parseInt(storedIndex)) || parseInt(storedIndex) >= THEMES.length) {
            themeIndex = Math.floor(Math.random() * THEMES.length);
            sessionStorage.setItem('chitravia_theme_index', themeIndex);
        } else {
            themeIndex = parseInt(storedIndex);
        }

        // Disable Animation for internal pages
        heroBg.classList.add('static-bg');
    }

    const selected = THEMES[themeIndex];
    if (!selected) return;

    // Apply background
    let bgUrl = selected.url;
    // Mobile optimization: If width < 768px, try to request a smaller image if it's an Unsplash URL
    if (window.innerWidth <= 768 && bgUrl.includes('images.unsplash.com')) {
        // Replace w=1920 with w=800
        bgUrl = bgUrl.replace('w=1920', 'w=800');
    }
    heroBg.style.backgroundImage = `url('${bgUrl}')`;

    // Apply dynamic accent color
    document.documentElement.style.setProperty('--accent-color', selected.color);

    // Calculate and apply accent glow (Hex to RGBA)
    const hex = selected.color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const glowColor = `rgba(${r}, ${g}, ${b}, 0.15)`; // Lower opacity for subtle background glow

    document.documentElement.style.setProperty('--accent-glow', glowColor);

    // Also use this color for new ambient lights
    createAmbientLights(selected.color);
}

function createAmbientLights(baseColor) {
    const container = document.querySelector('.ambient-light');
    if (!container) return;

    container.innerHTML = ''; // Clear existing

    // Mobile Optimization: Reduce orbs significantly
    const isMobile = window.innerWidth <= 768;
    const numOrbs = isMobile ? 3 : (10 + Math.floor(Math.random() * 6)); // Reduce to 3 on mobile

    for (let i = 0; i < numOrbs; i++) {
        const orb = document.createElement('div');
        orb.className = 'light-orb';

        // Random properties with larger sizes and LOWER opacity
        const size = 300 + Math.random() * 800;
        const x = Math.random() * 100; // 0-100vw
        const y = Math.random() * 100; // 0-100vh
        const opacity = 0.03 + Math.random() * 0.05; // Very subtle: 0.03 to 0.08

        orb.style.width = `${size}px`;
        orb.style.height = `${size}px`;
        orb.style.left = `${x}vw`;
        orb.style.top = `${y}vh`;
        orb.style.background = `radial-gradient(circle, ${baseColor}, transparent 65%)`;
        orb.style.opacity = opacity;

        // CSS optimization hints
        orb.style.willChange = 'transform';

        // Random drift/movement
        const duration = 20000 + Math.random() * 30000; // 20-50s
        const xMove1 = (Math.random() - 0.5) * 80; // +/- 40vw
        const yMove1 = (Math.random() - 0.5) * 80;
        const xMove2 = (Math.random() - 0.5) * 80;
        const yMove2 = (Math.random() - 0.5) * 80;

        // On mobile, disable complex animation if very laggy, but just reducing count helps most.
        // We will keep animation but ensure it uses transform
        orb.animate([
            { transform: `translate3d(0, 0, 0) scale(1)` },
            { transform: `translate3d(${xMove1}vw, ${yMove1}vh, 0) scale(1.1)` },
            { transform: `translate3d(${xMove2}vw, ${yMove2}vh, 0) scale(0.9)` },
            { transform: `translate3d(0, 0, 0) scale(1)` }
        ], {
            duration: duration,
            iterations: Infinity,
            direction: 'alternate',
            easing: 'ease-in-out',
            delay: Math.random() * -20000
        });

        container.appendChild(orb);
    }
}


// --- Modern Custom Dropdown Logic ---
document.addEventListener('DOMContentLoaded', function () {
    const wrapper = document.querySelector('.custom-select-wrapper');
    if (!wrapper) return;

    const select = wrapper.querySelector('.custom-select');
    const trigger = wrapper.querySelector('.custom-select__trigger');
    const triggerText = trigger.querySelector('span');
    const options = wrapper.querySelectorAll('.custom-option');
    const hiddenInput = document.querySelector('#project-type-input');

    // Toggle Dropdown
    trigger.addEventListener('click', function () {
        select.classList.toggle('open');
    });

    // Handle Option Click
    options.forEach(option => {
        option.addEventListener('click', function () {
            // Remove 'selected' from all
            options.forEach(opt => opt.classList.remove('selected'));

            // Add 'selected' to clicked
            this.classList.add('selected');

            // Update trigger text
            triggerText.textContent = this.textContent;
            triggerText.style.color = 'var(--text-primary)'; // Make selected text white

            // Update hidden input value
            hiddenInput.value = this.getAttribute('data-value');

            // Close dropdown
            select.classList.remove('open');
        });
    });

    // Close Dropdown when clicking outside
    document.addEventListener('click', function (e) {
        if (!wrapper.contains(e.target)) {
            select.classList.remove('open');
        }
    });
});


// Fetch Projects from Supabase
// Lightbox Global State
let currentGalleryImages = [];
let currentImageIndex = 0;

// Fetch Projects from Supabase
async function fetchFeaturedProjects() {
    // Check if supabaseClient is defined (config.js loaded)
    if (typeof supabaseClient === 'undefined') {
        console.log('Supabase client not loaded. Skipping dynamic fetch.');
        return;
    }

    const portfolioGrid = document.querySelector('.portfolio-grid');
    if (!portfolioGrid) return;

    try {
        const { data: projects, error } = await supabaseClient
            .from('projects')
            .select('*')
            .eq('category', 'featured')
            .order('created_at', { ascending: false })
            .limit(3);

        if (error) {
            console.error('Error fetching projects:', error);
            return;
        }

        if (projects && projects.length > 0) {
            // Keep the 'View All' tile if it exists
            const viewAllTile = portfolioGrid.querySelector('.view-all');

            // Clear existing static placeholders
            portfolioGrid.innerHTML = '';

            projects.forEach((project, index) => {
                // Handle multiple images (comma separated)
                let images = [];
                if (project.image_url) {
                    images = project.image_url.split(',');
                }
                const bgImage = images.length > 0 ? images[0] : 'assets/project-placeholder.jpg';
                const imageCount = images.length;

                // Create Item
                const item = document.createElement('div');
                item.className = `portfolio-item p${(index % 6) + 1}`;
                item.innerHTML = `
                <img src="${bgImage}" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0;">
                ${imageCount > 1 ? '<div style="position:absolute; top:10px; right:10px; background:rgba(0,0,0,0.6); color:white; padding:2px 8px; border-radius:10px; font-size:0.8rem; z-index:2;"><i class="fas fa-images"></i> ' + imageCount + '</div>' : ''}
                <div class="portfolio-overlay">
                    <h3>${project.title}</h3>
                    <p class="text-gold" style="margin-top:5px; font-size:0.9rem; text-transform: uppercase; letter-spacing: 1px;">${project.category}</p>
                </div>
            `;
                // Add Click Handler for Lightbox
                item.addEventListener('click', () => {
                    openLightbox(images, project.title);
                });

                portfolioGrid.appendChild(item);
            });

            // Re-append 'View All' tile
            if (viewAllTile) {
                const link = viewAllTile.querySelector('a');
                if (link) link.href = 'projects.html';
                portfolioGrid.appendChild(viewAllTile);
            }
        }
    } catch (err) {
        console.error("Supabase fetch error:", err);
    }
}

// --- Lightbox Functions ---
function openLightbox(images, title) {
    if (!images || images.length === 0) return;

    currentGalleryImages = images;
    currentImageIndex = 0;

    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return; // Guard clause if elements missing

    const lightboxCaption = document.getElementById('lightbox-caption');

    lightbox.style.display = 'flex';
    if (lightboxCaption) lightboxCaption.textContent = title;

    updateLightboxImage();
    renderThumbnails();
}

function updateLightboxImage() {
    const lightboxImg = document.getElementById('lightbox-img');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (lightboxImg) lightboxImg.src = currentGalleryImages[currentImageIndex];

    // Highlight thumbnail
    const thumbs = document.querySelectorAll('.thumb');
    thumbs.forEach((t, i) => {
        if (i === currentImageIndex) t.classList.add('active');
        else t.classList.remove('active');
    });

    // Hide arrows if only 1 image
    if (currentGalleryImages.length <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
    } else {
        if (prevBtn) prevBtn.style.display = 'block';
        if (nextBtn) nextBtn.style.display = 'block';
    }
}

function renderThumbnails() {
    const thumbsContainer = document.getElementById('lightbox-thumbnails');
    if (!thumbsContainer) return;

    thumbsContainer.innerHTML = '';
    if (currentGalleryImages.length <= 1) return;

    currentGalleryImages.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'thumb';
        img.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent closing
            currentImageIndex = index;
            updateLightboxImage();
        });
        thumbsContainer.appendChild(img);
    });
}

// Lightbox Event Listeners (Run once on load)
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.querySelector('.close-lightbox');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.style.display = 'none';
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImageIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
            updateLightboxImage();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
            updateLightboxImage();
        });
    }
});

// Contact Form Submission
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm && typeof supabaseClient !== 'undefined') {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameEl = document.getElementById('contact-name');
            const emailEl = document.getElementById('contact-email');
            const phoneEl = document.getElementById('contact-phone');
            const typeEl = document.getElementById('project-type-input');
            const messageEl = document.getElementById('contact-message');
            const submitBtn = document.getElementById('contact-submit-btn');
            const statusMsg = document.getElementById('contact-status-msg');

            if (!nameEl || !emailEl || !messageEl || !submitBtn || !statusMsg) return;

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            statusMsg.textContent = '';

            try {
                const { error } = await supabaseClient
                    .from('leads')
                    .insert([{
                        name: nameEl.value,
                        email: emailEl.value,
                        phone: phoneEl ? phoneEl.value : '',
                        project_type: typeEl ? typeEl.value : '',
                        message: messageEl.value
                    }]);

                if (error) throw error;

                statusMsg.textContent = 'Message sent successfully! We will get back to you soon.';
                statusMsg.style.color = '#4CAF50';
                contactForm.reset();

                // reset custom select
                const customSelectTrigger = document.querySelector('.custom-select__trigger span');
                if (customSelectTrigger) customSelectTrigger.textContent = 'Project Type';
                const customOptions = document.querySelectorAll('.custom-option');
                customOptions.forEach(opt => opt.classList.remove('selected'));
                if (customOptions.length > 0) customOptions[0].classList.add('selected');
                if (typeEl) typeEl.value = '';

            } catch (err) {
                console.error('Error submitting form:', err);
                statusMsg.textContent = 'Failed to send message. Please try again later.';
                statusMsg.style.color = '#F44336';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        });
    }
});
