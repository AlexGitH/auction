import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface ItemAttrs {
    name: string;
    startPrice: number;
    userId: string;
    description?: string;
}

interface ItemModel extends mongoose.Model<ItemDoc> {
    build(itemAttrs: ItemAttrs): ItemDoc;
}

interface ItemDoc extends mongoose.Document {
    name: string;
    startPrice: number;
    userId: string;
    description?: string;
    version: number;
    orderId?: string;
}

const itemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        startPrice: {
            type: Number,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        orderId: {
            type: String,
        },
        description: {
            type: String,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

// rename default version field(rename '__v').
itemSchema.set('versionKey', 'version');

// to manage versions properly
itemSchema.plugin(updateIfCurrentPlugin);

itemSchema.statics.build = (itemAttrs: ItemAttrs) => new Item(itemAttrs);

const Item = mongoose.model<ItemDoc, ItemModel>('Item', itemSchema);

export { Item };
