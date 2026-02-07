const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'review is required'],
            trim: true,
            minlength: [3, 'title must be at least 3 characters'],
            maxlength: [100, 'title cannot exceed 100 characters'],
        },
        content: {
            type: String,
            required: [true, 'review content is required'],
            minlength: [10, 'content must be at least 10 characters '],
            maxlength: [5000, 'content cannot exceed 5000 '],
        },
        gameName: {
            type: String,
            required: [true, 'game name is required'],
            trim: true,
            maxlength: [100, 'game name cannot exceed 100 characters'],
        },
        rating: {
            type: Number,
            required: [true, 'rating is required'],
            min: [1, 'rating must be at least 1'],
            max: [10, 'rating cannot exceed 10'],
        },
        platform: {
            type: String,
            trim: true,
            maxlength: [50, 'platform cannot exceed 50 characters'],
        },
        genre: {
            type: String,
            trim: true,
            maxlength: [50, 'genre cannot exceed 50 characters'],
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// index for better query performnace
reviewSchema.index({ author: 1, createdAt: -1 });
reviewSchema.index({ gameName: 1 });

module.exports = mongoose.model('Review', reviewSchema);