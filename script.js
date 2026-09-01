document.addEventListener("DOMContentLoaded", () => {
    // GSAP Intro Animation
    gsap.to(".card", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
    });

    gsap.from(".stars i", {
        opacity: 0,
        scale: 0.5,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.3,
        ease: "back.out(1.7)"
    });

    // Removing chip GSAP animation to fix visibility issues
    gsap.set(".chip", { opacity: 1, y: 0 });

    // Rating Logic
    const stars = document.querySelectorAll('.stars i');
    const ratingText = document.getElementById('rating-text');
    let currentRating = 0; // Starts empty

    const ratingDescriptions = {
        1: "Poor",
        2: "Fair",
        3: "Good",
        4: "Very Good",
        5: "Excellent"
    };

    stars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const val = parseInt(this.getAttribute('data-value'));
            highlightStars(val);
        });

        star.addEventListener('mouseout', function() {
            highlightStars(currentRating);
        });

        star.addEventListener('click', function() {
            const newRating = parseInt(this.getAttribute('data-value'));
            if (currentRating !== newRating) {
                currentRating = newRating;
                highlightStars(currentRating);
                ratingText.textContent = ratingDescriptions[currentRating];
                renderChips(currentRating);
                
                if (currentRating === 5 && typeof confetti === 'function') {
                    confetti({
                        particleCount: 120,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#1B2A60', '#F59E0B', '#3B82F6', '#FFD700', '#FFFFFF']
                    });
                }
            }
        });
    });

    function highlightStars(val) {
        stars.forEach(star => {
            const starVal = parseInt(star.getAttribute('data-value'));
            if (starVal <= val) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    // Message Chip Logic
    const chipsContainer = document.getElementById('chips-container');
    let selectedMessage = "";

    const commentsData = {
        5: [
            "Really loved the peaceful ambiance and hospitality at Kutani Stays. Wonderful experience in Jaipur!",
            "Amazing stay in Jaipur! Clean rooms, beautiful aesthetics, and very polite and helpful staff.",
            "Had a truly tranquil and relaxing stay here. Excellent service and great hospitality.",
            "One of the best stays in Jaipur. Cozy rooms, lovely vibe, and top-notch cleanliness.",
            "Very memorable stay at Kutani Stays! Peaceful atmosphere and smooth check-in experience."
        ],
        4: [
            "Good hospitality and clean rooms. Had a comfortable stay in Jaipur.",
            "Really liked the calm ambiance and decent service at Kutani Stays.",
            "Nice aesthetic, polite staff, and overall a pleasant stay in Jaipur.",
            "Comfortable and serene place to stay in Jaipur. Good overall experience.",
            "Had a nice and relaxing time here. Good service and well-maintained rooms."
        ],
        3: [
            "Stay was okay overall. I’d like to share a little feedback.",
            "My experience was decent. A few things could be improved.",
            "Overall an okay stay, but room amenities and service have room for improvement.",
            "Average experience. Sharing some quick feedback for improvement.",
            "Decent stay, but I’d appreciate if you could look into my feedback."
        ],
        2: [
            "The stay could have been much better. I’d like to share my feedback.",
            "I wasn’t fully satisfied with the room service and experience.",
            "Faced a few issues during my stay. Please review my feedback.",
            "I’d like to share some concerns regarding my stay.",
            "Service and experience need improvement. Sharing my feedback."
        ],
        1: [
            "I was not satisfied with my stay experience. Please review.",
            "Faced significant issues during my stay. Sharing my feedback.",
            "Experience was not as expected. Please look into this.",
            "I’d like to share my concerns respectfully.",
            "Hoping the management addresses these issues soon."
        ]
    };

    function renderChips(rating) {
        chipsContainer.innerHTML = '';
        selectedMessage = "";
        checkSubmitState();

        if (rating === 0) return;

        let chipsList = commentsData[rating] || [];

        chipsList.forEach(text => {
            const btn = document.createElement('button');
            btn.className = 'chip';
            btn.textContent = text;
            chipsContainer.appendChild(btn);
        });

        if (typeof gsap !== 'undefined') {
            gsap.fromTo(".chip", 
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" }
            );
        }
    }

    // Event delegation for dynamically added chips
    chipsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('chip')) {
            const allChips = chipsContainer.querySelectorAll('.chip');
            allChips.forEach(c => c.classList.remove('selected'));
            
            e.target.classList.add('selected');
            selectedMessage = e.target.textContent;
            
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(e.target, 
                    { scale: 0.98 }, 
                    { scale: 1, duration: 0.25, ease: "back.out(2)" }
                );
            }
            
            checkSubmitState();
        }
    });

    // Submit Logic
    const submitBtn = document.getElementById('submit-btn');
    
    // Exact Google Review link provided by user
    const GOOGLE_REVIEW_URL = "https://g.page/r/CRsA8u_KlJDIEBM/review";

    const WHATSAPP_NUMBER = "917340021807";

    function checkSubmitState() {
        if (currentRating > 0 && selectedMessage !== "") {
            submitBtn.removeAttribute('disabled');
            if (currentRating <= 3) {
                submitBtn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Share Feedback';
            } else {
                submitBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy & Post on Google';
            }
        } else {
            submitBtn.setAttribute('disabled', 'true');
            submitBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy & Post on Google';
        }
    }

    submitBtn.addEventListener('click', () => {
        if (submitBtn.disabled) return;
        
        if (currentRating <= 3) {
            // WhatsApp Redirection
            let message = selectedMessage;
            let whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
            window.location.href = whatsappUrl;
        } else {
            // Copy to clipboard for Google Review
            navigator.clipboard.writeText(selectedMessage).then(() => {
                // Button animation feedback
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = `<span>Copied! Redirecting...</span> <i class="fa-solid fa-check"></i>`;
                submitBtn.style.backgroundColor = "#10B981"; // Success green
                
                gsap.fromTo(submitBtn, 
                    { scale: 0.95 }, 
                    { scale: 1, duration: 0.3, ease: "back.out(2)" }
                );

                // Redirect after short delay
                setTimeout(() => {
                    window.location.href = GOOGLE_REVIEW_URL;
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.backgroundColor = "";
                }, 1500);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                alert("Could not copy message. Please try again.");
            });
        }
    });
});
