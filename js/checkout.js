// Checkout Page JavaScript
document.addEventListener('DOMContentLoaded', function () {
    const checkoutForm = document.getElementById('checkoutForm');
    const orderItems = document.getElementById('orderItems');
    const orderSubtotal = document.getElementById('orderSubtotal');
    const orderTotal = document.getElementById('orderTotal');
    const emptyCart = document.getElementById('emptyCart');
    const checkoutWrapper = document.querySelector('.checkout-wrapper');
    const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');
    const cardDetails = document.getElementById('cardDetails');

    // Load cart from localStorage
    function loadCart() {
        const saved = localStorage.getItem('boukilibre_cart');
        return saved ? JSON.parse(saved) : [];
    }

    const cartItems = loadCart();

    // Check if cart is empty
    if (cartItems.length === 0) {
        checkoutWrapper.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }

    // Render order items
    function renderOrderItems() {
        orderItems.innerHTML = cartItems.map(item => `
            <div class="order-item">
                <div class="order-item-info">
                    <h4>${item.title}</h4>
                    <span class="order-item-category">Telechargement numerique</span>
                </div>
                <span class="order-item-price">${item.price.toLocaleString()} FCFA</span>
            </div>
        `).join('');

        // Calculate totals
        const subtotal = cartItems.reduce((total, item) => total + item.price, 0);
        orderSubtotal.textContent = subtotal.toLocaleString() + ' FCFA';
        orderTotal.textContent = subtotal.toLocaleString() + ' FCFA';
    }

    renderOrderItems();

    // Payment method toggle
    paymentOptions.forEach(option => {
        option.addEventListener('change', function () {
            if (this.value === 'card') {
                cardDetails.style.display = 'block';
            } else {
                cardDetails.style.display = 'none';
            }
        });
    });

    // Form submission
    checkoutForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;

        // Validate form
        const email = document.getElementById('email').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const terms = document.getElementById('terms').checked;
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

        if (!terms) {
            alert('Veuillez accepter les conditions generales de vente.');
            return;
        }

        // Show loading state
        submitBtn.innerHTML = `
            <svg class="spinner" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="60">
                    <animate attributeName="stroke-dashoffset" from="60" to="0" dur="1s" repeatCount="indefinite"/>
                </circle>
            </svg>
            Traitement en cours...
        `;
        submitBtn.disabled = true;

        try {
            // Prepare order data
            const orderData = {
                customer: {
                    firstName,
                    lastName,
                    email,
                    phone: document.getElementById('phone').value
                },
                items: cartItems,
                paymentMethod,
                newsletter: document.getElementById('newsletter').checked,
                total: cartItems.reduce((total, item) => total + item.price, 0)
            };

            // Send to server
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                // Clear cart
                localStorage.removeItem('boukilibre_cart');

                // Show success and redirect
                submitBtn.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Commande confirmee !
                `;
                submitBtn.style.background = 'var(--color-success)';

                // Redirect to success page (or show success message)
                setTimeout(() => {
                    alert('Merci pour votre commande ! Vous allez recevoir un email avec le lien de telechargement.');
                    window.location.href = 'index.html';
                }, 1500);

            } else {
                throw new Error('Erreur lors du paiement');
            }

        } catch (error) {
            // Show error
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            alert('Une erreur est survenue lors du paiement. Veuillez reessayer.');
        }
    });

    // Format card number input
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
            let formattedValue = '';

            for (let i = 0; i < value.length && i < 16; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }

            e.target.value = formattedValue;
        });
    }

    // Format expiry date input
    const cardExpiry = document.getElementById('cardExpiry');
    if (cardExpiry) {
        cardExpiry.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }

            e.target.value = value;
        });
    }

    // Format CVC input
    const cardCvc = document.getElementById('cardCvc');
    if (cardCvc) {
        cardCvc.addEventListener('input', function (e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
        });
    }
});
