const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Ebook = require('../models/Ebook');
const paymentService = require('../services/paymentService');
const emailService = require('../services/emailService');

// Create new order
router.post('/', async (req, res) => {
    try {
        const { items, customerEmail, customerName, paymentMethod } = req.body;

        // Validation
        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'No items in cart' });
        }

        if (!customerEmail) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Fetch ebook details and calculate total
        const ebookIds = items.map(item => item.id);
        const ebooks = await Ebook.find({ _id: { $in: ebookIds }, isActive: true });

        if (ebooks.length !== items.length) {
            return res.status(400).json({ error: 'Some ebooks are not available' });
        }

        const orderItems = ebooks.map(ebook => ({
            ebookId: ebook._id,
            title: ebook.title,
            price: ebook.price
        }));

        const totalAmount = orderItems.reduce((sum, item) => sum + item.price, 0);

        // Create payment session based on payment method
        let paymentResult;

        switch (paymentMethod) {
            case 'stripe':
                paymentResult = await paymentService.createStripePayment(orderItems, totalAmount, customerEmail);
                break;
            case 'paypal':
                paymentResult = await paymentService.createPayPalPayment(orderItems, totalAmount);
                break;
            case 'moov':
                paymentResult = await paymentService.createMoovPayment(orderItems, totalAmount, req.body.phone);
                break;
            case 'mixx':
                paymentResult = await paymentService.createMixxPayment(orderItems, totalAmount, req.body.phone);
                break;
            default:
                return res.status(400).json({ error: 'Invalid payment method' });
        }

        // Create order
        const order = new Order({
            customerEmail,
            customerName,
            items: orderItems,
            totalAmount,
            paymentMethod,
            transactionId: paymentResult.transactionId,
            paymentStatus: 'pending'
        });

        await order.save();

        res.json({
            orderId: order._id,
            orderNumber: order.orderNumber,
            paymentUrl: paymentResult.paymentUrl,
            transactionId: paymentResult.transactionId
        });

    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: 'Error creating order', message: error.message });
    }
});

// Stripe webhook
router.post('/stripe-webhook', async (req, res) => {
    try {
        const event = paymentService.verifyStripeWebhook(req.body, req.headers['stripe-signature']);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            await processSuccessfulPayment(session.metadata.orderId, 'stripe', session.id);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Stripe webhook error:', error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
});

// PayPal webhook
router.post('/paypal-webhook', async (req, res) => {
    try {
        const verified = await paymentService.verifyPayPalWebhook(req.body, req.headers);

        if (verified && req.body.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
            const orderId = req.body.resource.purchase_units[0].custom_id;
            await processSuccessfulPayment(orderId, 'paypal', req.body.resource.id);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('PayPal webhook error:', error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
});

// Process successful payment
async function processSuccessfulPayment(orderId, paymentMethod, transactionId) {
    try {
        const order = await Order.findById(orderId).populate('items.ebookId');

        if (!order) {
            console.error('Order not found:', orderId);
            return;
        }

        // Update order status
        order.paymentStatus = 'completed';
        order.transactionId = transactionId;

        // Generate download links (valid for 30 days)
        const downloadLinks = order.items.map(item => ({
            ebookId: item.ebookId,
            url: `${process.env.SITE_URL}/api/download/${order._id}/${item.ebookId}`,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        }));

        order.downloadLinks = downloadLinks;
        await order.save();

        // Send confirmation email with download links
        await emailService.sendOrderConfirmationEmail(order, downloadLinks);
        order.emailSent = true;
        await order.save();

        console.log('Order processed successfully:', order.orderNumber);
    } catch (error) {
        console.error('Error processing payment:', error);
    }
}

// Get order details
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.ebookId');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching order', message: error.message });
    }
});

module.exports = router;
