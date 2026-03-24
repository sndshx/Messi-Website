document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Sticky Header
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Scroll Progress
    const progressBar = document.getElementById('progressBar');
    window.addEventListener('scroll', () => {
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollAmount = (window.scrollY / docHeight) * 100;
        progressBar.style.width = `${scrollAmount}%`;
    });

    // Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Only enable custom cursor on desktop
    if(window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
            
            // Adding a tiny delay effect to outline
            setTimeout(() => {
                cursorOutline.style.left = `${e.clientX}px`;
                cursorOutline.style.top = `${e.clientY}px`;
            }, 50);
        });

        // Interactive elements cursor effect
        const interactives = document.querySelectorAll('a, button, .gallery-item, .trophy-card, .achievement-card');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorOutline.style.backgroundColor = 'transparent';
            });
        });
    }

    // 2. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        if (navLinks.classList.contains('active')) {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'rgba(5, 5, 5, 0.98)';
            navLinks.style.padding = '30px';
            navLinks.style.textAlign = 'center';
            navLinks.style.backdropFilter = 'blur(15px)';
            navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
        } else {
            navLinks.style.display = 'none';
        }
    });

    // 3. Smooth Scrolling for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                navLinks.classList.remove('active');
                if (window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                }
            }
        });
    });

    // 4. Reveal Animations on Scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .timeline-item, .achievement-card, .about-image, .about-text, .gallery-item, .trophy-card, .fact-item, .family-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        revealObserver.observe(el);
    });

    // Dynamic active class style injection
    if (!document.getElementById('reveal-style')) {
        const style = document.createElement('style');
        style.id = 'reveal-style';
        style.textContent = `
            .active {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 5. Stats Counter Animation
    const statsSection = document.getElementById('stats');
    let counted = false;

    if(statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !counted) {
                animateCounters();
                counted = true;
            }
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        const speed = 100; // lower is faster

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText.replace(/[^0-9]/g, '');
                const inc = Math.max(1, Math.floor(target / speed));

                if (count < target) {
                    counter.innerText = count + inc;
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target + "+";
                }
            };
            updateCount();
        });
    }

    // 6. Gallery Modal
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('img01');
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const trophyGalleryItems = document.querySelectorAll('.trophy-gallery-item img');
    const closeBtn = document.querySelector('.close-modal');

    if(modal && modalImg && closeBtn) {
        // Regular gallery items
        galleryItems.forEach(img => {
            img.addEventListener('click', () => {
                modal.style.display = 'flex';
                modalImg.src = img.src;
                document.body.style.overflow = 'hidden';
            });
        });

        // Trophy gallery items
        trophyGalleryItems.forEach(img => {
            img.addEventListener('click', () => {
                modal.style.display = 'flex';
                modalImg.src = img.src;
                document.body.style.overflow = 'hidden';
            });
        });

        const achievementCards = document.querySelectorAll('.achievement-card[data-src]');
        achievementCards.forEach(card => {
            card.addEventListener('click', () => {
                modal.style.display = 'flex';
                modalImg.src = card.getAttribute('data-src');
                document.body.style.overflow = 'hidden'; 
            });
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // 7. 3D Tilt Effect on Cards (Vanilla implementation)
    const tiltCards = document.querySelectorAll('.achievement-card, .trophy-card');
    
    if(window.matchMedia("(pointer: fine)").matches) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within the element
                const y = e.clientY - rect.top;  // y position within the element
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const tiltX = ((y - centerY) / centerY) * -10; // max 10deg
                const tiltY = ((x - centerX) / centerX) * 10;
                
                card.style.transform = `perspective(1000px) scale(1.05) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
                card.style.zIndex = "10";
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) scale(1) rotateX(0deg) rotateY(0deg)';
                card.style.zIndex = "1";
            });
        });
    }
});
