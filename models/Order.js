const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    customerEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    customerName: {
        type: String,
        trim: true
    },
    items: [{
        ebookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ebook',
            required: true
        },
        title: String,
        price: Number
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['stripe', 'paypal', 'moov', 'mixx']
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    transactionId: {
        type: String,
        required: true
    },
    downloadLinks: [{
        ebookId: mongoose.Schema.Types.ObjectId,
        url: String,
        expiresAt: Date
    }],
    emailSent: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Generate unique order number
orderSchema.pre('save', async function (next) {
    if (this.isNew) {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 7).toUpperCase();
        this.orderNumber = `BKL-${timestamp}-${random}`;
    }
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Order', orderSchema);
