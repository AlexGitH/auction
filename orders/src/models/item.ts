import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface ItemAttrs {
    id: string;
    name: string;
    finalPrice: number;
}

export interface ItemDoc extends mongoose.Document {
    name: string;
    finalPrice: number;
    version: number;
    isReserved(): Promise<boolean>;
}

interface ItemModel extends mongoose.Model<ItemDoc> {
    build(attrs: ItemAttrs): ItemDoc;
    // by id an prev. version
    findByEvent(event: {
        id: string;
        version: number;
    }): Promise<ItemDoc | null>;
}

const itemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        finalPrice: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

// rename default version field(rename '__v').
itemSchema.set('versionKey', 'version');

// to manage item versions properly
itemSchema.plugin(updateIfCurrentPlugin);

itemSchema.statics.findByEvent = (event: { id: string; version: number }) => {
    return Item.findOne({
        _id: event.id,
        version: event.version - 1,
    });
};

itemSchema.statics.build = (attrs: ItemAttrs) => {
    return new Item({
        _id: attrs.id,
        name: attrs.name,
        finalPrice: attrs.finalPrice,
    });
};

itemSchema.methods.isReserved = async function () {
    const existingOrder = await Order.findOne({
        item: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete,
            ],
        },
    });

    return !!existingOrder;
};

const Item = mongoose.model<ItemDoc, ItemModel>('Item', itemSchema);

export { Item };
