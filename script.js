// Theme notification and toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeNotification = document.getElementById('themeNotification');
    const closeNotification = document.getElementById('closeNotification');
    
    // Debug check for notification element
    console.log("Theme notification element:", themeNotification);
    
    // FORCE NOTIFICATION TO SHOW FOR TESTING
    // Remove this line after testing if it works
    localStorage.removeItem('theme-notification-seen');
    
    // Show theme notification on first visit
    function showThemeNotification() {
        // First, verify elements exist
        if (!themeNotification) {
            console.error('Theme notification element not found');
            return;
        }
        
        // Check if user has already seen the notification
        const hasSeenNotification = localStorage.getItem('theme-notification-seen');
        console.log("Has seen notification:", hasSeenNotification);
        
        // Show notification immediately for troubleshooting
        themeNotification.style.display = 'flex';
        console.log('Theme notification display set to flex');
        
        // If you want to use the delayed approach later:
        /*
        if (!hasSeenNotification) {
            // Show notification after 1 second
            setTimeout(() => {
                themeNotification.style.display = 'flex';
                console.log('Theme notification displayed');
            }, 1000);
        }
        */
    }
    
    // Initialize theme notification
    showThemeNotification();
    
    // Handle notification close button click
    if (closeNotification) {
        closeNotification.addEventListener('click', () => {
            if (themeNotification) {
                themeNotification.style.display = 'none';
                // Store that user has seen notification only after they close it
                localStorage.setItem('theme-notification-seen', 'true');
                console.log('Notification closed and marked as seen');
            }
        });
    }
    
    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            
            // Store theme preference
            if (document.body.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
        
        // Apply saved theme on load
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark');
        }
    }
});

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle code (keep your existing code here)
    
    // Fix for Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobileMenu');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuButton && navLinks) {
        // Add event listener to toggle mobile menu
        mobileMenuButton.addEventListener('click', function() {
            console.log('Mobile menu clicked'); // Debug log
            navLinks.classList.toggle('open');
            mobileMenuButton.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking on a nav link (for better UX)
        const menuLinks = navLinks.querySelectorAll('.nav-link');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('open');
                mobileMenuButton.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    } else {
        console.error('Mobile menu elements not found!');
    }
});

// 3D Tilt Effect on Elements
document.addEventListener('DOMContentLoaded', function() {
    // Select all elements that should have the 3D effect
    const tiltElements = document.querySelectorAll('.project-card, .achievement-card, .skills-category, .contact-item, .info-item, .glass-card');
    
    // Add event listeners to each element
    tiltElements.forEach(element => {
        element.addEventListener('mouseenter', startTiltEffect);
        element.addEventListener('mouseleave', resetTiltEffect);
        element.addEventListener('mousemove', tiltEffect);
    });
    
    // Start tilt effect
    function startTiltEffect() {
        this.style.transition = 'transform 0.1s ease';
        this.classList.add('tilting');
    }
    
    // Reset position when mouse leaves
    function resetTiltEffect() {
        this.style.transition = 'transform 0.5s ease';
        this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        this.classList.remove('tilting');
    }
    
    // Calculate and apply tilt based on mouse position
    function tiltEffect(e) {
        if (!this.classList.contains('tilting')) return;
        
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left; // X position within the element
        const y = e.clientY - rect.top; // Y position within the element
        
        const width = rect.width;
        const height = rect.height;
        
        // Calculate tilt rotation (max 10 degrees)
        const tiltX = ((y / height) * 2 - 1) * -10; // Reverse Y-axis for natural tilt
        const tiltY = ((x / width) * 2 - 1) * 10;
        
        // Apply transform with slight scale and translateZ for depth
        this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px) scale(1.03)`;
    }
});

// Contact Form Submission with EmailJS
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init("Naveenkumar Kalluri"); // Replace with your actual EmailJS user ID
    
    // Get the contact form
    const contactForm = document.getElementById('contactForm');
    
    // Form submission handler
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = {
                name: contactForm.elements.name.value,
                email: contactForm.elements.email.value,
                subject: contactForm.elements.subject.value,
                message: contactForm.elements.message.value
            };
            
            // Send email using EmailJS
            emailjs.send(
                'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
                'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    subject: formData.subject,
                    message: formData.message
                }
            )
            .then(function() {
                // Show success message
                showFormMessage('success', 'Your message has been sent successfully!');
                
                // Reset the form
                contactForm.reset();
            })
            .catch(function(error) {
                // Show error message
                console.error('Email sending failed:', error);
                showFormMessage('error', 'Sorry, there was a problem sending your message.');
            })
            .finally(function() {
                // Restore button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }
    
    // Function to show form feedback message
    function showFormMessage(type, message) {
        // Create message element if it doesn't exist
        let messageEl = document.getElementById('formMessage');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'formMessage';
            contactForm.insertAdjacentElement('afterend', messageEl);
        }
        
        // Set message content and style
        messageEl.className = `form-message ${type}`;
        messageEl.innerHTML = message;
        messageEl.style.display = 'block';
        
        // Auto-hide message after 5 seconds
        setTimeout(() => {
            messageEl.style.opacity = '0';
            setTimeout(() => {
                messageEl.style.display = 'none';
                messageEl.style.opacity = '1';
            }, 500);
        }, 5000);
    }
});

// Background Music Player - Enhanced autoplay
document.addEventListener('DOMContentLoaded', function() {
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicToggle = document.getElementById('musicToggle');
    const muteIcon = document.getElementById('muteIcon');
    const volumeIcon = document.getElementById('volumeIcon');
    
    // Check if user has a saved preference
    const musicPreference = localStorage.getItem('musicPreference');
    
    // Set initial volume to a lower, less intrusive level
    backgroundMusic.volume = 0.2;
    
    // Function to play music
    function playMusic() {
        backgroundMusic.play().then(() => {
            // Success - update UI
            musicToggle.classList.add('playing');
            muteIcon.style.display = 'none';
            volumeIcon.style.display = 'inline-block';
            localStorage.setItem('musicPreference', 'on');
        }).catch(err => {
            console.log('Autoplay prevented by browser, waiting for interaction');
        });
    }
    
    // Try to autoplay immediately (likely will be blocked)
    if (musicPreference !== 'off') {
        playMusic();
    } else {
        // User previously turned off music
        muteIcon.style.display = 'inline-block';
        volumeIcon.style.display = 'none';
    }
    
    // Listen for ANY user interaction with the page
    const interactions = ['click', 'touchstart', 'keydown', 'scroll', 'mousemove'];
    
    interactions.forEach(event => {
        document.addEventListener(event, function() {
            // Play music if it's paused and user hasn't explicitly turned it off
            if (backgroundMusic.paused && musicPreference !== 'off') {
                playMusic();
            }
        }, { once: true }); // Only trigger once for the first interaction
    });
    
    // Toggle button functionality
    if (musicToggle) {
        musicToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent this click from triggering the document event listeners
            
            if (backgroundMusic.paused) {
                playMusic();
                localStorage.setItem('musicPreference', 'on');
            } else {
                backgroundMusic.pause();
                musicToggle.classList.remove('playing');
                muteIcon.style.display = 'inline-block';
                volumeIcon.style.display = 'none';
                localStorage.setItem('musicPreference', 'off');
            }
        });
    }
});