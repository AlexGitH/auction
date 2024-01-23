import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Item } from '../../models/item';
// import { natsWrapper } from '../../nats-wrapper';

const ROUTE = '/api/items';

it('returns a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`${ROUTE}/${id}`)
        .set('Cookie', global.signin())
        .send({
            name: 'asdfjasdf',
            startPrice: 20,
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
        });

    await request(app)
        .put(`${ROUTE}/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            name: 'test',
            startPrice: 1000,
        })
        .expect(401);
});

it('returns a 400 if the user provides invalid name or startPrice for item', async () => {
    const name = 'kasjdfksjd';
    const cookie = global.signin();

    const response = await request(app)
        .post(ROUTE)
        .set('Cookie', cookie)
        .send({
            name,
            startPrice: 25,
        });

    await request(app)
        .put(`${ROUTE}/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: '',
            startPrice: 1000,
        })
        .expect(400);

    await request(app)
        .put(`${ROUTE}/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name,
            startPrice: -1000,
        })
        .expect(400);

    await request(app)
        .put(`${ROUTE}/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name,
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
        });

    await request(app)
        .put(`${ROUTE}/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: 'new name',
            startPrice: 100,
        })
        .expect(200);

    const itemResponse = await request(app)
        .get(`${ROUTE}/${response.body.id}`)
        .send();

    expect(itemResponse.body.name).toEqual('new name');
    expect(itemResponse.body.startPrice).toEqual(100);
});

// it('publishes an event', async () => {
//     const name = 'aksdfkasdfasd';
//     const cookie = global.signin();

//     const response = await request(app)
//         .post(ROUTE)
//         .set('Cookie', cookie)
//         .send({
//             name,
//             startPrice: 25,
//         });

//     await request(app)
//         .put(`${ROUTE}/${response.body.id}`)
//         .set('Cookie', cookie)
//         .send({
//             name: 'new name',
//             startPrice: 100,
//         })
//         .expect(200);

//     expect(natsWrapper.client.publish).toHaveBeenCalled();
// });

it('rejects updates if the item is reserved', async () => {
    const name = 'kasjdfksjd';
    const cookie = global.signin();

    const response = await request(app)
        .post(ROUTE)
        .set('Cookie', cookie)
        .send({
            name,
            startPrice: 25,
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
        })
        .expect(400);
});
