const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');

// Contact form submission
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }

        // Send email to admin
        await emailService.sendContactEmail(name, email, message);

        // Send confirmation to user
        await emailService.sendContactConfirmation(name, email);

        res.json({ message: 'Votre message a été envoyé avec succès. Nous vous répondrons bientôt !' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ error: 'Erreur lors de l\'envoi du message', message: error.message });
    }
});

module.exports = router;
