import mongoose from 'mongoose';
import { Password } from '../services/password';

// All the interfaces below are used when it is not possible
// to control types with TypeScript

// An interface that describes the properties
// that are required to create a new User
interface UserAttrs {
    email: string;
    password: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(userAttrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that User Document has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.password;
                delete ret.__v;
            },
        },
    }
);

userSchema.pre('save', async function (done) {
    // not arrow function to get access to User as this
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done(); // always should be run to complete function execution
});

userSchema.statics.build = (userAttrs: UserAttrs) => new User(userAttrs);

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };

// const user = new User({email: 'skdf@klkdf.ls', password: '230jkdj23'})

// example of using static method
// User.build({email: 'skdf@klkdf.ls', password: '230jkdj23'})
