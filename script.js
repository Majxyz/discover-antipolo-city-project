// Modern Tourist Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Header scroll effect
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Tourist Attraction Gallery Functionality
    const attractionCards = document.querySelectorAll('.attraction-card');
    
    attractionCards.forEach(card => {
        initializeAttractionCard(card);
    });

    function initializeAttractionCard(card) {
        const galleryTrack = card.querySelector('.gallery-track');
        const images = card.querySelectorAll('.gallery-image');
        const prevBtn = card.querySelector('.prev-btn');
        const nextBtn = card.querySelector('.next-btn');
        const dots = card.querySelectorAll('.dot');
        const favoriteBtn = card.querySelector('.favorite-btn');
        
        let currentSlide = 1;
        const totalSlides = images.length;

        // Navigation functions
        function showSlide(index) {
            images.forEach((img, i) => {
                img.classList.toggle('active', i === index);
            });
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            currentSlide = index;
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
        }

        // Event listeners
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showSlide(index));
        });

        // Touch/swipe functionality for mobile
        let startX = 0;
        let endX = 0;
        let isDragging = false;

        galleryTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        galleryTrack.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });

        galleryTrack.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            endX = e.changedTouches[0].clientX;
            isDragging = false;
            
            const diffX = startX - endX;
            const threshold = 50;
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        });

        // Mouse drag functionality for desktop
        let mouseStartX = 0;
        let mouseEndX = 0;
        let isMouseDragging = false;

        galleryTrack.addEventListener('mousedown', (e) => {
            mouseStartX = e.clientX;
            isMouseDragging = true;
            e.preventDefault();
        });

        galleryTrack.addEventListener('mousemove', (e) => {
            if (!isMouseDragging) return;
            e.preventDefault();
        });

        galleryTrack.addEventListener('mouseup', (e) => {
            if (!isMouseDragging) return;
            mouseEndX = e.clientX;
            isMouseDragging = false;
            
            const diffX = mouseStartX - mouseEndX;
            const threshold = 50;
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        });

        // Auto-play functionality (optional)
        let autoPlayInterval;
        
        function startAutoPlay() {
            autoPlayInterval = setInterval(nextSlide, 5000);
        }
        
        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }
        
        // Start auto-play when card is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startAutoPlay();
                } else {
                    stopAutoPlay();
                }
            });
        });
        
        observer.observe(card);
        
        // Pause auto-play on hover
        card.addEventListener('mouseenter', stopAutoPlay);
        card.addEventListener('mouseleave', startAutoPlay);

        // Favorite functionality
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', function(e) {
                e.preventDefault();
                this.classList.toggle('favorited');
                
                const isFavorited = this.classList.contains('favorited');
                const attractionName = card.querySelector('.attraction-title').textContent;
                
                if (isFavorited) {
                    console.log(`Added ${attractionName} to favorites`);
                    // Here you would typically save to localStorage or send to server
                    localStorage.setItem(`favorite_${card.dataset.attraction}`, 'true');
                } else {
                    console.log(`Removed ${attractionName} from favorites`);
                    localStorage.removeItem(`favorite_${card.dataset.attraction}`);
                }
            });
            
            // Load saved favorite state
            const isFavorited = localStorage.getItem(`favorite_${card.dataset.attraction}`) === 'true';
            if (isFavorited) {
                favoriteBtn.classList.add('favorited');
            }
        }

        // Image click to open lightbox
        images.forEach(img => {
            img.addEventListener('click', function() {
                openLightbox(this.src, this.alt);
            });
        });
    }

    // Lightbox functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const closeBtn = document.querySelector('.close-btn');

    function openLightbox(src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('show');
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    closeBtn.addEventListener('click', closeLightbox);
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('show')) {
            closeLightbox();
        }
    });


    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.destination-card, .gallery-img, .contact-item, .contact-form');
    animatedElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });

    // Parallax effect for hero section
    const hero = document.getElementById('hero');
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    });

    // Mobile menu toggle (for future implementation)
    function createMobileMenu() {
        const nav = document.querySelector('nav');
        const navLinks = document.querySelector('.nav-links');
        
        // Create hamburger button
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger';
        hamburger.innerHTML = '☰';
        hamburger.style.cssText = `
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-dark);
        `;
        
        // Add hamburger to nav
        nav.appendChild(hamburger);
        
        // Toggle mobile menu
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('mobile-open');
        });
        
        // Show hamburger on mobile
        if (window.innerWidth <= 768) {
            hamburger.style.display = 'block';
            navLinks.style.display = 'none';
        }
    }

    // Initialize mobile menu
    createMobileMenu();

    // Handle window resize
    window.addEventListener('resize', function() {
        const navLinks = document.querySelector('.nav-links');
        const hamburger = document.querySelector('.hamburger');
        
        if (window.innerWidth <= 768) {
            if (hamburger) hamburger.style.display = 'block';
            navLinks.style.display = 'none';
        } else {
            if (hamburger) hamburger.style.display = 'none';
            navLinks.style.display = 'flex';
            navLinks.classList.remove('mobile-open');
        }
    });

    // Add loading animation to page
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Card hover effects
    const cards = document.querySelectorAll('.destination-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Smooth reveal animation for sections
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
    });

    console.log('Antipolo Tourism Website - JavaScript loaded successfully!');
});
