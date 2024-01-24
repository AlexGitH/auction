import request from 'supertest';
import { app } from '../../app';
import { Item } from '../../models/item';
// import { natsWrapper } from '../../nats-wrapper';

const ROUTE = '/api/items';

it(`has a route handler listening to ${ROUTE} for post requests`, async () => {
    const response = await request(app).post(ROUTE).send({});

    expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
    await request(app)
        .post(ROUTE)
        .send({})
        .expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
    const response = await request(app)
        .post(ROUTE)
        .set('Cookie', global.signin())
        .send({});
    expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid name is provided', async () => {
    await request(app)
        .post(ROUTE)
        .set('Cookie', global.signin())
        .send({
            name: '',
            startPrice: 10,
            description: 'text',
        })
        .expect(400);

    await request(app)
        .post(ROUTE)
        .set('Cookie', global.signin())
        .send({
            startPrice: 10,
            description: 'text',
        })
        .expect(400);
});

it('returns an error if an invalid description is provided', async () => {
    await request(app)
        .post(ROUTE)
        .set('Cookie', global.signin())
        .send({
            name: 'name',
            startPrice: 10,
            description: '',
        })
        .expect(400);

    await request(app)
        .post(ROUTE)
        .set('Cookie', global.signin())
        .send({
            name: 'name',
            startPrice: 10,
        })
        .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
    await request(app)
        .post(ROUTE)
        .set('Cookie', global.signin())
        .send({
            name: 'kasjdfksjd',
            startPrice: -10,
            description: 'text',
        })
        .expect(400);

    await request(app)
        .post(ROUTE)
        .set('Cookie', global.signin())
        .send({
            name: 'kasjdfksjd',
            description: 'text',
        })
        .expect(400);
});

it('creates an item with valid inputs', async () => {
    // check the item number (empty because of cleanup before each test)
    let items = await Item.find({});
    expect(items.length).toEqual(0);

    const name = 'kasjdfksjd';
    const startPrice = 25;
    const description = 'text';

    await request(app)
        .post(ROUTE)
        .set('Cookie', global.signin())
        .send({ name, startPrice, description })
        .expect(201);

    // check the item number (should be 1 in case of success)
    items = await Item.find({});
    expect(items.length).toEqual(1);
    expect(items[0].startPrice).toEqual(startPrice);
    expect(items[0].name).toEqual(name);
    expect(items[0].description).toEqual(description);
});

// it('publishes an event', async () => {
//     const name = 'asasdfas';

//     await request(app)
//         .post(ROUTE)
//         .set('Cookie', global.signin())
//         .send({
//             name,
//             startPrice: 25,
//         })
//         .expect(201);

//     expect(natsWrapper.client.publish).toHaveBeenCalled();
// });
