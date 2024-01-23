import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@fairdeal/common';
import { Item } from '../models/item';

const router = express.Router();

router.get(
    '/api/items/currentuser',
    requireAuth,
    validateRequest,
    async (req: Request, res: Response) => {
    const userId = req?.currentUser?.id;
    console.log({userId, date: new Date()});
    const items = await Item.find({
        userId
    });

    return res.send(items);
});

export { router as userItemsRouter };
