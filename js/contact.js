// Contact Form JavaScript
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const contactFormMessage = document.getElementById('contactFormMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const message = document.getElementById('contactMessageInput').value;

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, message })
                });

                const data = await response.json();

                if (response.ok) {
                    contactFormMessage.textContent = data.message;
                    contactFormMessage.className = 'contact-message success';
                    contactForm.reset();
                } else {
                    contactFormMessage.textContent = data.error || 'Une erreur est survenue. Veuillez réessayer.';
                    contactFormMessage.className = 'contact-message error';
                }
            } catch (error) {
                contactFormMessage.textContent = 'Erreur de connexion. Veuillez réessayer plus tard.';
                contactFormMessage.className = 'contact-message error';
            }

            // Hide message after 5 seconds
            setTimeout(() => {
                contactFormMessage.style.display = 'none';
            }, 5000);
        });
    }
});
