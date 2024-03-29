import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
    requireAuth,
    validateRequest,
    NotFoundError,
    NotAuthorizedError,
    BadRequestError,
} from '@fairdeal/common';
import { Item } from '../models/item';
import { natsWrapper } from '../nats-wrapper';
import { ItemUpdatedPublisher } from '../events/item-updated-publisher';

const router = express.Router();

router.put(
    '/api/items/:id',
    requireAuth,
    [
        body('name').not().isEmpty().withMessage('Item name is required'),
        body('startPrice')
            .isFloat({ gt: 0 })
            .withMessage('Start price must be provided and must be greater than 0'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const item = await Item.findById(req.params.id);

        if (!item) {
            throw new NotFoundError();
        }

        if (item.orderId) {
            throw new BadRequestError(' Cannot edit a reserved item');
        }

        if (item.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        const { name, startPrice, finalPrice, description } = req?.body || {};

        item.set({ name, startPrice, finalPrice, description });

        console.log('+++++ item update', { name, startPrice, finalPrice, description });
        await item.save();
        await new ItemUpdatedPublisher(natsWrapper.client).publish({
            id: item.id,
            version: item.version,
            name: item.name,
            startPrice: item.startPrice,
            finalPrice: item.finalPrice,
            userId: item.userId,
            description: item.description,
        })

        return res.send(item);
    }
);

export { router as updateItemRouter };
