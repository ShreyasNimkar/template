import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

export interface UserInput {
    email: string;
    regNo: string;
    name: string;
    password: string;
    profilePic: string;
    username: string;
    phoneNo: string;
}

export interface UserDocument extends UserInput, mongoose.Document {
    passwordChangedAt: Date;
    admin: boolean;
    active: boolean;
    correctPassword(password: string): Promise<boolean>;
    changedPasswordAfter(JWTTimestrap: number): boolean;
}

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            trim: true,
            lowercase: true,
        },
        regNo: {
            type: String,
            unique: true,
            required: true,
        },
        profilePic: {
            type: String,
        },
        phoneNo: Number,
        username: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
        },
        password: {
            type: String,
            select: false,
        },
        passwordChangedAt: {
            type: Date,
            default: Date.now(),
        },
        admin: {
            type: Boolean,
            default: false,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

userSchema.pre(/^find/, function (next) {
    const query = this as mongoose.Query<UserDocument[], UserDocument>;
    query.find({ active: true });
    next();
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const hashedPassword = await bcrypt.hash(this.password!, 12);
    this.password = hashedPassword;
    next();
});

userSchema.methods.correctPassword = async function (inPass: string): Promise<boolean> {
    const user = this as UserDocument;
    return await bcrypt.compare(inPass, user.password);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestrap: number): boolean {
    const changedTimestrap: number = Number(this.passwordChangedAt.getTime()) / 1000;
    return JWTTimestrap < changedTimestrap;
};

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
