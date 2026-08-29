const mongoose = require('mongoose');

const ebookSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['ebook', 'application', 'outil'],
        default: 'ebook'
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        default: 2000
    },
    coverImage: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileName: {
        type: String
    },
    benefits: [{
        type: String
    }],
    tableOfContents: [{
        chapter: String,
        description: String
    }],
    targetAudience: [{
        type: String
    }],
    features: [{
        type: String
    }],
    badge: {
        type: String,
        enum: ['Nouveau', 'Populaire', 'Bestseller', ''],
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
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

// Update the updatedAt timestamp before saving
ebookSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Ebook', ebookSchema);
