import mongoose from 'mongoose';
import { OrderStatus } from '@fairdeal/common';
import { ItemDoc } from './item';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface OrderAttrs {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    item: ItemDoc;
}

interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    item: ItemDoc;
    version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(OrderStatus),
            default: OrderStatus.Created,
        },
        expiresAt: {
            type: mongoose.Schema.Types.Date,
        },
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
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
orderSchema.set('versionKey', 'version');

// to manage item versions properly
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => new Order(attrs);

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order, OrderStatus };
