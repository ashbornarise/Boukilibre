const express = require('express');
const router = express.Router();
const multer = require('multer');
const Ebook = require('../models/Ebook');
const { requireAdmin } = require('../middleware/auth');
const { uploadFile } = require('../lib/blob');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 4.5 * 1024 * 1024 } // stays under the Vercel serverless request body limit
});

const JSON_FIELDS = ['benefits', 'tableOfContents', 'targetAudience', 'features'];

function parseJsonFields(body) {
    const parsed = { ...body };
    JSON_FIELDS.forEach((field) => {
        if (typeof parsed[field] === 'string' && parsed[field].trim() !== '') {
            try {
                parsed[field] = JSON.parse(parsed[field]);
            } catch (e) {
                parsed[field] = [];
            }
        } else if (!Array.isArray(parsed[field])) {
            parsed[field] = [];
        }
    });
    return parsed;
}

// Get all ebooks/applications/outils (public catalog)
router.get('/', async (req, res) => {
    try {
        const { type, category, search, sort } = req.query;
        let query = { isActive: true };

        if (type && type !== 'all') {
            query.type = type;
        }

        if (category && category !== 'all') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        let sortOption = { createdAt: -1 };
        if (sort === 'price-low') sortOption = { price: 1 };
        if (sort === 'price-high') sortOption = { price: -1 };

        const ebooks = await Ebook.find(query).sort(sortOption);
        res.json(ebooks);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching ebooks', message: error.message });
    }
});

// Get every product including inactive ones (admin dashboard)
router.get('/admin/all', requireAdmin, async (req, res) => {
    try {
        const ebooks = await Ebook.find().sort({ createdAt: -1 });
        res.json(ebooks);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching ebooks', message: error.message });
    }
});

// Get single ebook/application/outil by ID
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

// Create new product with optional file uploads (admin only)
router.post('/', requireAdmin, upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'productFile', maxCount: 1 }
]), async (req, res) => {
    try {
        const data = parseJsonFields(req.body);

        if (req.files?.coverImage?.[0]) {
            data.coverImage = await uploadFile(req.files.coverImage[0], 'covers');
        }

        if (req.files?.productFile?.[0]) {
            const file = req.files.productFile[0];
            data.fileUrl = await uploadFile(file, 'files');
            data.fileName = file.originalname;
        } else if (data.fileUrlExternal) {
            data.fileUrl = data.fileUrlExternal;
        }
        delete data.fileUrlExternal;

        const ebook = new Ebook(data);
        await ebook.save();
        res.status(201).json(ebook);
    } catch (error) {
        res.status(400).json({ error: 'Error creating ebook', message: error.message });
    }
});

// Update product, replacing files only if new ones are provided (admin only)
router.put('/:id', requireAdmin, upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'productFile', maxCount: 1 }
]), async (req, res) => {
    try {
        const data = parseJsonFields(req.body);

        if (req.files?.coverImage?.[0]) {
            data.coverImage = await uploadFile(req.files.coverImage[0], 'covers');
        }

        if (req.files?.productFile?.[0]) {
            const file = req.files.productFile[0];
            data.fileUrl = await uploadFile(file, 'files');
            data.fileName = file.originalname;
        } else if (data.fileUrlExternal) {
            data.fileUrl = data.fileUrlExternal;
        }
        delete data.fileUrlExternal;

        const ebook = await Ebook.findByIdAndUpdate(
            req.params.id,
            data,
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
router.delete('/:id', requireAdmin, async (req, res) => {
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
