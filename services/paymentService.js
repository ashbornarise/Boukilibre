const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create Stripe payment session
async function createStripePayment(items, totalAmount, customerEmail) {
    const lineItems = items.map(item => ({
        price_data: {
            currency: 'xof', // West African CFA franc
            product_data: {
                name: item.title,
                description: 'Ebook numérique - Téléchargement immédiat'
            },
            unit_amount: item.price // Stripe uses smallest currency unit
        },
        quantity: 1
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.SITE_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.SITE_URL}/catalog.html`,
        customer_email: customerEmail,
        metadata: {
            orderId: '' // Will be set after order creation
        }
    });

    return {
        transactionId: session.id,
        paymentUrl: session.url
    };
}

// Verify Stripe webhook
function verifyStripeWebhook(payload, signature) {
    return stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
    );
}

// Create PayPal payment
async function createPayPalPayment(items, totalAmount) {
    // Note: This is a simplified version. In production, use PayPal SDK properly
    // For now, returning a placeholder
    return {
        transactionId: `PAYPAL-${Date.now()}`,
        paymentUrl: `${process.env.SITE_URL}/paypal-checkout.html`
    };
}

// Verify PayPal webhook
async function verifyPayPalWebhook(payload, headers) {
    // In production, implement proper PayPal webhook verification
    // For now, returning true as placeholder
    return true;
}

// Create Moov Money payment
async function createMoovPayment(items, totalAmount, phone) {
    // Note: This requires Moov Money API integration
    // Placeholder implementation
    return {
        transactionId: `MOOV-${Date.now()}`,
        paymentUrl: `${process.env.SITE_URL}/moov-payment.html?amount=${totalAmount}&phone=${phone}`
    };
}

// Create Mixx by Yas payment
async function createMixxPayment(items, totalAmount, phone) {
    // Note: This requires Mixx by Yas API integration
    // Placeholder implementation
    return {
        transactionId: `MIXX-${Date.now()}`,
        paymentUrl: `${process.env.SITE_URL}/mixx-payment.html?amount=${totalAmount}&phone=${phone}`
    };
}

module.exports = {
    createStripePayment,
    verifyStripeWebhook,
    createPayPalPayment,
    verifyPayPalWebhook,
    createMoovPayment,
    createMixxPayment
};
