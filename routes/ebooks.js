const express = require('express');
const router = express.Router();
const Ebook = require('../models/Ebook');

// Get all ebooks
router.get('/', async (req, res) => {
    try {
        const { category, search, sort } = req.query;
        let query = { isActive: true };

        // Filter by category
        if (category && category !== 'all') {
            query.category = category;
        }

        // Search
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Sort
        let sortOption = { createdAt: -1 }; // Default: newest first
        if (sort === 'price-low') sortOption = { price: 1 };
        if (sort === 'price-high') sortOption = { price: -1 };

        const ebooks = await Ebook.find(query).sort(sortOption);
        res.json(ebooks);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching ebooks', message: error.message });
    }
});

// Get single ebook by ID
router.get('/:id', async (req, res) => {
    try {
        const ebook = await Ebook.findById(req.params.id);

        if (!ebook) {
            return res.status(404).json({ error: 'Ebook not found' });
        }

        res.json(ebook);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching ebook', message: error.message });
    }
});

// Create new ebook (admin only - add authentication middleware in production)
router.post('/', async (req, res) => {
    try {
        const ebook = new Ebook(req.body);
        await ebook.save();
        res.status(201).json(ebook);
    } catch (error) {
        res.status(400).json({ error: 'Error creating ebook', message: error.message });
    }
});

// Update ebook (admin only)
router.put('/:id', async (req, res) => {
    try {
        const ebook = await Ebook.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!ebook) {
            return res.status(404).json({ error: 'Ebook not found' });
        }

        res.json(ebook);
    } catch (error) {
        res.status(400).json({ error: 'Error updating ebook', message: error.message });
    }
});

// Delete ebook (admin only - soft delete)
router.delete('/:id', async (req, res) => {
    try {
        const ebook = await Ebook.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!ebook) {
            return res.status(404).json({ error: 'Ebook not found' });
        }

        res.json({ message: 'Ebook deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting ebook', message: error.message });
    }
});

module.exports = router;
