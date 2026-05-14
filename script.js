document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Custom Cursor Glow ---
    const cursor = document.getElementById('cursor-glow');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor follow
    function animateCursor() {
        // Interpolation for smooth delay
        let distX = mouseX - cursorX;
        let distY = mouseY - cursorY;
        
        cursorX += distX * 0.1;
        cursorY += distY * 0.1;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.addEventListener('mousedown', () => cursor.classList.add('active'));
    document.addEventListener('mouseup', () => cursor.classList.remove('active'));

    // --- 2. Scroll Progress Bar ---
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        scrollProgress.style.width = `${progress}%`;
    });

    // --- 3. Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function openMenu() {
        mobileMenu.classList.remove('hidden');
        // small delay to allow display block to apply before opacity transition
        setTimeout(() => {
            mobileMenu.classList.remove('opacity-0');
        }, 10);
    }

    function closeMenu() {
        mobileMenu.classList.add('opacity-0');
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
        }, 300);
    }

    mobileMenuBtn.addEventListener('click', openMenu);
    closeMenuBtn.addEventListener('click', closeMenu);
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // --- 4. Scroll Reveal Animations (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 5. Animated Counters ---
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseInt(target.getAttribute('data-target'));
                let startValue = 0;
                const duration = 2000; // ms
                const increment = endValue / (duration / 16); // 60fps
                
                const updateCounter = () => {
                    startValue += increment;
                    if (startValue < endValue) {
                        target.innerText = Math.ceil(startValue);
                        requestAnimationFrame(updateCounter);
                    } else {
                        target.innerText = endValue;
                    }
                };
                
                updateCounter();
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // --- 6. Populate Skills Grid ---
    const skills = [
        { name: "Meta Ads", icon: "facebook" },
        { name: "Google Ads", icon: "search" },
        { name: "Performance Mktg", icon: "activity" },
        { name: "Audience Targeting", icon: "crosshair" },
        { name: "A/B Testing", icon: "split-square-horizontal" },
        { name: "Google Analytics", icon: "bar-chart-2" },
        { name: "Canva Design", icon: "pen-tool" },
        { name: "Creative Strategy", icon: "lightbulb" },
        { name: "WhatsApp CRM", icon: "message-square" },
        { name: "GMB Optimization", icon: "map-pin" }
    ];

    const skillsGrid = document.getElementById('skills-grid');
    skills.forEach((skill, index) => {
        const delay = index * 100;
        const skillHTML = `
            <div class="glass-panel p-6 rounded-2xl border border-white/5 skill-card flex flex-col items-center justify-center text-center group cursor-pointer hover:-translate-y-2 transition-transform duration-300" style="animation-delay: ${delay}ms">
                <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-slate-300 group-hover:text-primary transition-colors">
                    <i data-lucide="${skill.icon}"></i>
                </div>
                <h4 class="font-medium text-white text-sm">${skill.name}</h4>
            </div>
        `;
        skillsGrid.insertAdjacentHTML('beforeend', skillHTML);
    });
    
    // Re-initialize Lucide icons for dynamically added content
    lucide.createIcons();

    // --- 7. Floating Particles (Canvas) ---
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particlesArray = [];

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            // Primary, Secondary, or Accent colors with low opacity
            const colors = ['rgba(139, 92, 246, 0.3)', 'rgba(59, 130, 246, 0.3)', 'rgba(6, 182, 212, 0.3)'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > width) this.speedX *= -1;
            if (this.y < 0 || this.y > height) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        const numberOfParticles = Math.min(window.innerWidth / 15, 100); // Responsive particle count
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // --- 8. Magnetic Buttons ---
    const magneticElements = document.querySelectorAll('.hover-magnetic');
    magneticElements.forEach(elem => {
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Move element slightly towards cursor
            elem.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        elem.addEventListener('mouseleave', () => {
            elem.style.transform = `translate(0px, 0px)`;
        });
    });
});
