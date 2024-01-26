import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Item } from '../../models/item';
import { natsWrapper } from '../../nats-wrapper';

const ROUTE = '/api/items';

it('returns a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`${ROUTE}/${id}`)
        .set('Cookie', global.signin())
        .send({
            name: 'asdfjasdf',
            startPrice: 20,
            finalPrice: 25,
            description: 'text',
        })
        .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`${ROUTE}/${id}`)
        .send({
            name: 'asdfjasdf',
            startPrice: 20,
            finalPrice: 25,
            description: 'text',
        })
        .expect(401);
});

it('returns a 401 if the user does not own the item', async () => {
    const name = 'kasjdfksjd';

    const response = await request(app)
        .post(ROUTE)
        .set('Cookie', global.signin())
        .send({
            name,
            startPrice: 25,
            finalPrice: 25,
            description: 'text',
        });

    await request(app)
        .put(`${ROUTE}/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            name: 'test',
            startPrice: 1000,
            finalPrice: 2500,
            description: 'text',
        })
        .expect(401);
});

it('returns a 400 if the user provides invalid name or startPrice or description for item', async () => {
    const name = 'kasjdfksjd';
    const cookie = global.signin();

    const response = await request(app)
        .post(ROUTE)
        .set('Cookie', cookie)
        .send({
            name,
            startPrice: 25,
            finalPrice: 25,
            description: 'text',
        });

    await request(app)
        .put(`${ROUTE}/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: '',
            startPrice: 1000,
            finalPrice: 2500,
            description: 'text',
        })
        .expect(400);

    await request(app)
        .put(`${ROUTE}/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name,
            startPrice: -1000,
            finalPrice: 2500,
            description: 'text',
        })
        .expect(400);

    await request(app)
        .put(`${ROUTE}/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name,
            description: 'text',
        })
        .expect(400);

    // invalid description
    await request(app)
        .put(`${ROUTE}/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name,
            startPrice: 1000,
            finalPrice: 2500,
            description: '',
        })
        .expect(400);

    await request(app)
        .put(`${ROUTE}/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name,
            startPrice: 1000,
            finalPrice: 2500,
        })
        .expect(400);

});

it('updates the item with valid values', async () => {
    const name = 'kasjdfksjd';
    const cookie = global.signin();

    const response = await request(app)
        .post(ROUTE)
        .set('Cookie', cookie)
        .send({
            name,
            startPrice: 25,
            finalPrice: 125,
            description: 'text',
        });

    await request(app)
        .put(`${ROUTE}/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: 'new name',
            startPrice: 100,
            finalPrice: 125,
            description: 'text2',
        })
        .expect(200);

    const itemResponse = await request(app)
        .get(`${ROUTE}/${response.body.id}`)
        .send();

    expect(itemResponse.body.name).toEqual('new name');
    expect(itemResponse.body.startPrice).toEqual(100);
    expect(itemResponse.body.description).toEqual('text2');
});

it('publishes an event', async () => {
    const name = 'aksdfkasdfasd';
    const cookie = global.signin();

    const response = await request(app)
        .post(ROUTE)
        .set('Cookie', cookie)
        .send({
            name,
            startPrice: 25,
            finalPrice: 125,
            description: 'desc',
        });

    await request(app)
        .put(`${ROUTE}/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: 'new name',
            startPrice: 100,
            finalPrice: 125,
            description: 'desc',
        })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the item is reserved', async () => {
    const name = 'kasjdfksjd';
    const description = 'text';
    const cookie = global.signin();

    const response = await request(app)
        .post(ROUTE)
        .set('Cookie', cookie)
        .send({
            name,
            startPrice: 25,
            finalPrice: 25,
            description,
        });

    const item = await Item.findById(response.body.id);
    item!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
    await item!.save();

    await request(app)
        .put(`${ROUTE}/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: 'new name',
            startPrice: 100,
            finalPrice: 250,
            description: 'text 2',
        })
        .expect(400);
});
