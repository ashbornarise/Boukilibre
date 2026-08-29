const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Redirect to the purchased file if the order is paid and the link hasn't expired
router.get('/:orderId/:ebookId', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate('items.ebookId');

        if (!order) {
            return res.status(404).send('Commande introuvable');
        }

        if (order.paymentStatus !== 'completed') {
            return res.status(403).send('Le paiement n\'est pas encore confirme');
        }

        const link = order.downloadLinks.find(
            (l) => l.ebookId.toString() === req.params.ebookId
        );

        if (!link) {
            return res.status(404).send('Fichier introuvable pour cette commande');
        }

        if (new Date() > new Date(link.expiresAt)) {
            return res.status(410).send('Ce lien de telechargement a expire');
        }

        const item = order.items.find(
            (i) => i.ebookId._id.toString() === req.params.ebookId
        );

        if (!item?.ebookId?.fileUrl) {
            return res.status(404).send('Fichier indisponible');
        }

        res.redirect(item.ebookId.fileUrl);
    } catch (error) {
        res.status(500).send('Erreur lors du telechargement');
    }
});

module.exports = router;
