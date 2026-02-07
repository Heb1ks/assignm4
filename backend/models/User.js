const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'please provide a valid email address',
            ],
        },
        password: {
            type: String,
            required: [true, 'password is required'],
            minlength: [6, 'password minimum 6 length'],
        },
        bio: {
            type: String,
            maxlength: [200, 'bio cannot exceed 200 characters'],
            default: '',
        },
        favoriteGenre: {
            type: String,
            maxlength: [50, 'favorite genre cannot exceed 50 characters'],
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('user', userSchema);