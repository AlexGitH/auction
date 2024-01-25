import express, { Request, Response } from 'express';
import {
    BadRequestError,
    NotFoundError,
    OrderStatus,
    requireAuth,
    validateRequest,
} from '@fairdeal/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Item } from '../models/item';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

// const EXPIRATION_WINDOW_SECONDS = 15 * 60;
const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post(
    '/api/orders',
    requireAuth,
    [
        body('itemId')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('Item id is required'),
    ],
    validateRequest,

    async (req: Request, res: Response) => {
        const { itemId } = req.body;

        // Find the Item the user is trying to order in the database
        const item = await Item.findById(itemId);

        if (!item) {
            throw new NotFoundError();
        }

        // Make sure that this item is not already reserved
        // Run query to look at all orders. Find an order where the item
        // is the item wev just found *and* the order status is *not* cancelled.
        // If we find the order from that means the item *is* reserved
        const isReserved = await item.isReserved();

        if (isReserved) {
            throw new BadRequestError('Item is already reserved');
        }

        // Calculate an Expiration date for this order
        const expiration = new Date();
        expiration.setSeconds(
            expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS
        );

        // Build the order and save it to the database
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            item,
        });

        await order.save();

        // Publish an event saying that an order was created
        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            item: {
                id: item.id,
                finalPrice: item.finalPrice,
            },
        });

        return res.status(201).send(order);
    }
);

export { router as newOrderRouter };
