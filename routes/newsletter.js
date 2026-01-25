const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');
const emailService = require('../services/emailService');

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Check if already subscribed
        let subscriber = await Subscriber.findOne({ email });

        if (subscriber) {
            if (subscriber.isActive) {
                return res.status(400).json({ message: 'Vous êtes déjà inscrit à notre newsletter' });
            } else {
                // Reactivate subscription
                subscriber.isActive = true;
                subscriber.subscribedAt = Date.now();
                subscriber.unsubscribedAt = null;
                await subscriber.save();
            }
        } else {
            // Create new subscriber
            subscriber = new Subscriber({ email });
            await subscriber.save();
        }

        // Send welcome email
        await emailService.sendWelcomeEmail(email);

        res.json({ message: 'Inscription réussie ! Vérifiez votre email.' });
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        res.status(500).json({ error: 'Error subscribing to newsletter', message: error.message });
    }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', async (req, res) => {
    try {
        const { email } = req.body;

        const subscriber = await Subscriber.findOne({ email });

        if (!subscriber) {
            return res.status(404).json({ error: 'Email not found in our newsletter' });
        }

        subscriber.isActive = false;
        subscriber.unsubscribedAt = Date.now();
        await subscriber.save();

        res.json({ message: 'Vous avez été désinscrit avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Error unsubscribing', message: error.message });
    }
});

// Get all subscribers (admin only)
router.get('/', async (req, res) => {
    try {
        const subscribers = await Subscriber.find({ isActive: true });
        res.json({ count: subscribers.length, subscribers });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching subscribers', message: error.message });
    }
});

module.exports = router;
