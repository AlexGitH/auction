import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@fairdeal/common';
import { Item } from '../models/item';
import { natsWrapper } from '../nats-wrapper';
import { ItemCreatedPublisher } from '../events/item-created-publisher';

const router = express.Router();

router.post(
    '/api/items',
    requireAuth,
    [
        body('name').not().isEmpty().withMessage('Item name is required'),
        body('startPrice')
            .isFloat({ gt: 0 })
            .withMessage('Start Price must be greater than 0'),
        body('description').not().isEmpty().withMessage('Item description is required'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { name, startPrice, description } = req.body;

        const item = Item.build({
            name,
            startPrice,
            userId: req.currentUser!.id,
            description,
        });

        await item.save();
        await new ItemCreatedPublisher(natsWrapper.client).publish({
            id: item.id,
            version: item.version,
            name: item.name,
            startPrice: item.startPrice,
            finalPrice: item.finalPrice,
            userId: item.userId,
            description: item.description,
        })

        return res.status(201).send(item);
    }
);

export { router as createItemRouter };
