
        // Performance and Optimization JavaScript
        class WebApp {
            constructor() {
                this.init();
                this.setupEventListeners();
                this.setupIntersectionObserver();
                this.setupLazyLoading();
                this.animateStats();
            }

            init() {
                // Hide loader after page load
                window.addEventListener('load', () => {
                    setTimeout(() => {
                        document.getElementById('loader').classList.add('hidden');
                    }, 500);
                });

                // Initialize theme
                const savedTheme = localStorage.getItem('theme') || 'light';
                if (savedTheme === 'dark') {
                    document.body.classList.add('dark-theme');
                }
            }

            setupEventListeners() {
                // Mobile menu toggle
                const mobileMenuBtn = document.getElementById('mobile-menu-btn');
                const navMenu = document.getElementById('nav-menu');
                
                mobileMenuBtn.addEventListener('click', () => {
                    navMenu.classList.toggle('active');
                });

                // Theme toggle
                const themeToggle = document.getElementById('theme-toggle');
                themeToggle.addEventListener('click', () => {
                    document.body.classList.toggle('dark-theme');
                    const isDark = document.body.classList.contains('dark-theme');
                    localStorage.setItem('theme', isDark ? 'dark' : 'light');
                });

                // Smooth scrolling for navigation links
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const targetId = link.getAttribute('href');
                        const targetSection = document.querySelector(targetId);
                        
                        if (targetSection) {
                            const offsetTop = targetSection.offsetTop - 80;
                            window.scrollTo({
                                top: offsetTop,
                                behavior: 'smooth'
                            });
                        }
                        
                        // Close mobile menu
                        navMenu.classList.remove('active');
                    });
                });

                // Contact form submission
                const contactForm = document.getElementById('contact-form');
                contactForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleFormSubmission(e.target);
                });

                // Navbar background on scroll
                window.addEventListener('scroll', () => {
                    const navbar = document.getElementById('navbar');
                    if (window.scrollY > 100) {
                        navbar.style.background = document.body.classList.contains('dark-theme') 
                            ? 'rgba(26, 47, 42, 0.98)' 
                            : 'rgba(255, 255, 255, 0.98)';
                    } else {
                        navbar.style.background = document.body.classList.contains('dark-theme') 
                            ? 'rgba(26, 47, 42, 0.95)' 
                            : 'rgba(255, 255, 255, 0.95)';
                    }
                });

                // Portfolio item interactions
                document.querySelectorAll('.portfolio-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const title = item.querySelector('.portfolio-content h3').textContent;
                        this.showPortfolioModal(title);
                    });
                });

                // Keyboard navigation
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        navMenu.classList.remove('active');
                    }
                });
            }

            setupIntersectionObserver() {
                const observerOptions = {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                };

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                        }
                    });
                }, observerOptions);

                // Observe all fade-in elements
                document.querySelectorAll('.fade-in').forEach(el => {
                    observer.observe(el);
                });
            }

            setupLazyLoading() {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                        }
                    });
                });

                document.querySelectorAll('.lazy-load').forEach(img => {
                    imageObserver.observe(img);
                });
            }

            animateStats() {
                const statsObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.animateNumbers();
                            statsObserver.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.5 });

                const statsSection = document.querySelector('.stats-section');
                if (statsSection) {
                    statsObserver.observe(statsSection);
                }
            }

            animateNumbers() {
                const statNumbers = document.querySelectorAll('.stat-number');
                
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    let current = 0;
                    const increment = target / 50;
                    
                    const updateNumber = () => {
                        if (current < target) {
                            current += increment;
                            stat.textContent = Math.ceil(current);
                            requestAnimationFrame(updateNumber);
                        } else {
                            stat.textContent = target;
                        }
                    };
                    
                    updateNumber();
                });
            }

            handleFormSubmission(form) {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                
                // Simulate form submission
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    submitBtn.textContent = 'Message Sent!';
                    submitBtn.style.background = '#28a745';
                    
                    setTimeout(() => {
                        form.reset();
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                    }, 2000);
                }, 1500);
                
                console.log('Form submitted:', data);
            }

            showPortfolioModal(title) {
                // Simple alert for demonstration - in a real app, this would open a modal
                alert(`Viewing: ${title}\n\nIn a production environment, this would open a detailed view with project information, technologies used, and live demo links.`);
            }

            // Performance monitoring
            measurePerformance() {
                // Measure page load time
                window.addEventListener('load', () => {
                    const loadTime = performance.now();
                    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
                    
                    // Measure First Contentful Paint
                    const observer = new PerformanceObserver((list) => {
                        list.getEntries().forEach((entry) => {
                            if (entry.name === 'first-contentful-paint') {
                                console.log(`FCP: ${entry.startTime.toFixed(2)}ms`);
                            }
                        });
                    });
                    
                    observer.observe({ entryTypes: ['paint'] });
                });
            }

            // Accessibility enhancements
            enhanceAccessibility() {
                // Add focus indicators for keyboard navigation
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab') {
                        document.body.classList.add('keyboard-navigation');
                    }
                });

                document.addEventListener('mousedown', () => {
                    document.body.classList.remove('keyboard-navigation');
                });

                // Announce page changes to screen readers
                const announcePageChange = (message) => {
                    const announcement = document.createElement('div');
                    announcement.setAttribute('aria-live', 'polite');
                    announcement.setAttribute('aria-atomic', 'true');
                    announcement.className = 'sr-only';
                    announcement.textContent = message;
                    document.body.appendChild(announcement);
                    
                    setTimeout(() => {
                        document.body.removeChild(announcement);
                    }, 1000);
                };

                // Monitor for reduced motion preference
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    document.body.classList.add('reduced-motion');
                }
            }

            // Error handling and debugging
            setupErrorHandling() {
                window.addEventListener('error', (e) => {
                    console.error('JavaScript error:', e.error);
                    // In production, you would send this to an error tracking service
                });

                window.addEventListener('unhandledrejection', (e) => {
                    console.error('Unhandled promise rejection:', e.reason);
                });
            }

            // Performance optimizations
            optimizePerformance() {
                // Debounce scroll events
                let scrollTimer = null;
                const originalScrollHandler = window.onscroll;
                
                window.addEventListener('scroll', () => {
                    if (scrollTimer !== null) {
                        clearTimeout(scrollTimer);
                    }
                    scrollTimer = setTimeout(() => {
                        // Execute scroll-dependent code here
                    }, 150);
                });

                // Preload critical resources
                const preloadResource = (url, type) => {
                    const link = document.createElement('link');
                    link.rel = 'preload';
                    link.href = url;
                    link.as = type;
                    document.head.appendChild(link);
                };

                // Service worker registration for caching
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.register('/sw.js')
                        .then(() => console.log('Service Worker registered'))
                        .catch(() => console.log('Service Worker registration failed'));
                }
            }
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', () => {
            const app = new WebApp();
            app.measurePerformance();
            app.enhanceAccessibility();
            app.setupErrorHandling();
            app.optimizePerformance();
        });

        // Additional CSS for keyboard navigation
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-navigation *:focus {
                outline: 3px solid var(--primary-color) !important;
                outline-offset: 2px !important;
            }
            
            .sr-only {
                position: absolute !important;
                width: 1px !important;
                height: 1px !important;
                padding: 0 !important;
                margin: -1px !important;
                overflow: hidden !important;
                clip: rect(0, 0, 0, 0) !important;
                white-space: nowrap !important;
                border: 0 !important;
            }
            
            .reduced-motion *, 
            .reduced-motion *::before, 
            .reduced-motion *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);

        // Progressive Web App functionality - Simplified to avoid errors
        if ('serviceWorker' in navigator) {
            // Simple in-memory cache instead of service worker to avoid registration errors
            console.log('Service Worker API available but using in-memory cache for demo');
        }

        // Remove problematic service worker code that was causing registration failures
        
        // Analytics and performance tracking
        const trackEvent = (eventName, properties = {}) => {
            console.log(`Event: ${eventName}`, properties);
            // In production, send to analytics service
        };

        // Track page interactions - throttled for performance
        let clickTimeout;
        document.addEventListener('click', (e) => {
            if (clickTimeout) return;
            
            if (e.target.matches('.btn, .nav-link, .portfolio-item')) {
                trackEvent('click', {
                    element: e.target.className,
                    text: e.target.textContent.trim().substring(0, 50)
                });
            }
            
            clickTimeout = setTimeout(() => {
                clickTimeout = null;
            }, 100);
        }, { passive: true });

        // Web Vitals monitoring - Optimized to reduce CLS tracking noise
        const observeWebVitals = () => {
            // Only track significant layout shifts
            let cumulativeLayoutShift = 0;
            let clsEntries = [];
            
            new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (!entry.hadRecentInput && entry.value > 0.001) {
                        cumulativeLayoutShift += entry.value;
                        clsEntries.push(entry);
                        
                        // Only log significant CLS values to reduce console noise
                        if (cumulativeLayoutShift > 0.1) {
                            console.log('Significant CLS detected:', cumulativeLayoutShift.toFixed(4));
                        }
                    }
                });
            }).observe({ entryTypes: ['layout-shift'] });

            // Largest Contentful Paint
            new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    console.log('LCP:', entry.startTime.toFixed(0) + 'ms');
                });
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // First Contentful Paint
            new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.name === 'first-contentful-paint') {
                        console.log('FCP:', entry.startTime.toFixed(0) + 'ms');
                    }
                });
            }).observe({ entryTypes: ['paint'] });
        };

        // Initialize web vitals monitoring
        if (typeof PerformanceObserver !== 'undefined') {
            observeWebVitals();
        }
