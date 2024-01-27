import express, { Request, Response } from 'express';
import {
    BadRequestError,
    NotAuthorizedError,
    NotFoundError,
    OrderStatus,
    requireAuth,
    validateRequest,
} from '@fairdeal/common';
import { body } from 'express-validator';
import { stripe } from '../stripe';
import { Order } from '../models/orders';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publisher/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
    '/api/payments',
    requireAuth,
    [
        body('token').not().isEmpty().withMessage('Token is required'),
        body('orderId').not().isEmpty().withMessage('Order id is required'),
    ],
    validateRequest,

    async (req: Request, res: Response) => {
        const { token, orderId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            throw new NotFoundError();
        }

        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError('Cannot pay for an cancelled order');
        }

        try {
            const charge = await stripe.charges.create({
                currency: 'usd',
                // cents are used in Stripe as lowest currency unit in US
                amount: order.finalPrice * 100,
                source: token,
                description: 'Another Testing Charge!!!',
            });
            console.log('+++++++++ charge passed!', charge.id);

            const payment = Payment.build({
                orderId,
                stripeId: charge.id,
            });
            await payment.save();

            new PaymentCreatedPublisher(natsWrapper.client).publish({
                id: payment.id,
                orderId: payment.orderId,
                stripeId: payment.stripeId,
            });

            return res.status(201).send({ id: payment.id });
        } catch (err) {
            console.log('------Charge error:', err);
        }
    }
);

export { router as createChargeRouter };
