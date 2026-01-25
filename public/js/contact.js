// Contact Form JavaScript
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const contactMessage = document.getElementById('contactMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const message = document.getElementById('contactMessage').value;

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
                    contactMessage.textContent = data.message;
                    contactMessage.className = 'contact-message success';
                    contactForm.reset();
                } else {
                    contactMessage.textContent = data.error || 'Une erreur est survenue. Veuillez réessayer.';
                    contactMessage.className = 'contact-message error';
                }
            } catch (error) {
                contactMessage.textContent = 'Erreur de connexion. Veuillez réessayer plus tard.';
                contactMessage.className = 'contact-message error';
            }

            // Hide message after 5 seconds
            setTimeout(() => {
                contactMessage.style.display = 'none';
            }, 5000);
        });
    }
});
