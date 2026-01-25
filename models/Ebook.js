const mongoose = require('mongoose');

const ebookSchema = new mongoose.Schema({
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
        enum: ['entrepreneuriat', 'developpement', 'etudes']
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
    pdfFile: {
        type: String,
        required: true
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
