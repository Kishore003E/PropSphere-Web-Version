// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements for brochure functionality
    const brochureBtn = document.querySelector('.nav-item:nth-child(4)');
    const mobileBrochureBtn = document.querySelector('.mobile-menu-item:nth-child(4)');
    const modal = document.getElementById('brochureModal');
    const closeBtn = document.querySelector('.close-btn');
    const requestButton = document.getElementById('requestButton');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const backToStep1Btn = document.getElementById('backToStep1');
    const brochureForm = document.getElementById('brochureForm');
    const nameInput = document.getElementById('name');
    const mobileInput = document.getElementById('mobile');
    const emailInput = document.getElementById('email');
    const nameError = document.getElementById('nameError');
    const mobileError = document.getElementById('mobileError');
    const emailError = document.getElementById('emailError');
    
    // Cache DOM elements for video view switching
    const changeViewBtn = document.querySelector('.nav-item:nth-child(1)');
    const mobileChangeViewBtn = document.querySelector('.mobile-menu-item:nth-child(1)');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    // Set up variables for video view switching
    let currentView = 1;
    
    // Create video view elements if they don't exist
    if (!document.getElementById('view1')) {
        setupVideoViews();
    }
    
    // Mobile menu toggle functionality
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
            mobileMenu.classList.remove('active');
        }
    });
    
    // Add event listeners for view switching
    if (changeViewBtn) {
        changeViewBtn.addEventListener('click', toggleView);
    }
    
    if (mobileChangeViewBtn) {
        mobileChangeViewBtn.addEventListener('click', function() {
            toggleView();
            // Hide mobile menu when switching view
            mobileMenu.classList.remove('active');
        });
    }
    
    // Open modal when brochure button is clicked (desktop version)
    brochureBtn.addEventListener('click', function() {
        modal.style.display = 'block';
        // Reset to step 1 when opening
        showStep(1);
        resetForm();
    });
    
    // Open modal when mobile brochure button is clicked
    if (mobileBrochureBtn) {
        mobileBrochureBtn.addEventListener('click', function() {
            modal.style.display = 'block';
            // Hide mobile menu when opening modal
            document.querySelector('.mobile-menu').classList.remove('active');
            // Reset to step 1 when opening
            showStep(1);
            resetForm();
        });
    }
    
    // Close modal when X is clicked
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
    
    // Move to form when request button is clicked
    requestButton.addEventListener('click', function() {
        showStep(2);
    });
    
    // Back button functionality
    backToStep1Btn.addEventListener('click', function() {
        showStep(1);
    });
    
    // Form submission handling
    brochureForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset error messages
        resetErrors();
        
        // Validate form
        if (validateForm()) {
            // Instead of Google Sheets, use FormSubmit
            submitToFormSubmit();
        }
    });
    
    // Function to set up video views
    function setupVideoViews() {
        const videoContainer = document.querySelector('.video-container');
        const backgroundVideo = document.getElementById('background-video');
        
        // Store original video source
        const originalVideoSrc = backgroundVideo ? backgroundVideo.querySelector('source').src : 'assets/dubai-background.mp4';
        
        // Clear video container
        const controlsElements = videoContainer.innerHTML;
        videoContainer.innerHTML = '';
        
        // Create first view with original video
        const view1 = document.createElement('div');
        view1.className = 'video-view active';
        view1.id = 'view1';
        view1.innerHTML = `
            <video autoplay muted loop id="background-video-1" class="background-video">
                <source src="${originalVideoSrc}" type="video/mp4">
            </video>
        `;
        
        // Create second view with new video
        const view2 = document.createElement('div');
        view2.className = 'video-view';
        view2.id = 'view2';
        view2.innerHTML = `
            <video autoplay muted loop id="background-video-2" class="background-video">
                <source src="assets/dubai-alternative-view.mp4" type="video/mp4">
            </video>
        `;
        
        // Add views to container
        videoContainer.appendChild(view1);
        videoContainer.appendChild(view2);
        
        // Add back the controls and other elements
        const controlsContainer = document.createElement('div');
        controlsContainer.innerHTML = controlsElements;
        
        // Get all direct child nodes except videos
        const childNodes = Array.from(controlsContainer.childNodes);
        childNodes.forEach(node => {
            if (node.id !== 'background-video' && node.nodeType === 1) {
                videoContainer.appendChild(node.cloneNode(true));
            }
        });
    }
    
    // Function to toggle between video views
    function toggleView() {
        const view1 = document.getElementById('view1');
        const view2 = document.getElementById('view2');
        const video1 = document.getElementById('background-video-1');
        const video2 = document.getElementById('background-video-2');
        
        if (currentView === 1) {
            // Switch to view 2
            view1.classList.remove('active');
            view2.classList.add('active');
            
            // Apply transition animations
            view1.classList.add('fade-out');
            view2.classList.add('fade-in');
            
            // Make sure the video is playing
            if (video2) video2.play();
            
            // Set current view
            currentView = 2;
        } else {
            // Switch to view 1
            view2.classList.remove('active');
            view1.classList.add('active');
            
            // Apply transition animations
            view2.classList.add('fade-out');
            view1.classList.add('fade-in');
            
            // Make sure the video is playing
            if (video1) video1.play();
            
            // Set current view
            currentView = 1;
        }
        
        // Remove animation classes after transition completes
        setTimeout(() => {
            view1.classList.remove('fade-in', 'fade-out');
            view2.classList.remove('fade-in', 'fade-out');
        }, 1000);
    }
    
    // Function to show specific step in brochure modal
    function showStep(stepNumber) {
        step1.style.display = 'none';
        step2.style.display = 'none';
        step3.style.display = 'none';
        
        if (stepNumber === 1) {
            step1.style.display = 'block';
        } else if (stepNumber === 2) {
            step2.style.display = 'block';
        } else if (stepNumber === 3) {
            step3.style.display = 'block';
        }
    }
    
    // Reset form fields and errors
    function resetForm() {
        brochureForm.reset();
        resetErrors();
    }
    
    // Reset error messages
    function resetErrors() {
        nameError.textContent = '';
        mobileError.textContent = '';
        emailError.textContent = '';
    }
    
    // Validate form inputs
    function validateForm() {
        let isValid = true;
        
        // Validate name (at least 2 characters)
        if (nameInput.value.trim().length < 2) {
            nameError.textContent = 'Please enter a valid name (at least 2 characters)';
            isValid = false;
        }
        
        // Validate mobile number (numbers only, 10-15 digits)
        const mobileRegex = /^\d{10,15}$/;
        if (!mobileRegex.test(mobileInput.value.trim())) {
            mobileError.textContent = 'Please enter a valid mobile number (10-15 digits)';
            isValid = false;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            emailError.textContent = 'Please enter a valid email address';
            isValid = false;
        }
        
        return isValid;
    }
    
    // Submit data using FormSubmit
    function submitToFormSubmit() {
        // Create a new hidden form
        const hiddenForm = document.createElement('form');
        hiddenForm.style.display = 'none';
        hiddenForm.method = 'POST';
        hiddenForm.action = 'https://formsubmit.co/kicha2003e@gmail.com'; // Replace with your email
        
        // Add form fields
        const fields = {
            name: nameInput.value.trim(),
            mobile: mobileInput.value.trim(),
            email: emailInput.value.trim(),
            brochure: 'Park Tower Dubai Brochure',
            timestamp: new Date().toISOString(),
            _subject: 'New Brochure Request',
            _captcha: 'false',
            _next: window.location.href // Stay on the same page
        };
        
        // Add the fields to the hidden form
        Object.keys(fields).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = fields[key];
            hiddenForm.appendChild(input);
        });
        
        // Add form to body, submit it, and remove it
        document.body.appendChild(hiddenForm);
        
        // Store data in localStorage before submitting
        // This ensures we know the user submitted the form even after redirect
        localStorage.setItem('brochureRequested', 'true');
        
        // Submit the form
        hiddenForm.submit();
        
        // Show success immediately, since FormSubmit will redirect
        showStep(3);
    }
    
    // Check if user is returning from FormSubmit submission
    if (localStorage.getItem('brochureRequested') === 'true') {
        // Clear the flag
        localStorage.removeItem('brochureRequested');
        // Show the success state
        modal.style.display = 'block';
        showStep(3);
    }
});