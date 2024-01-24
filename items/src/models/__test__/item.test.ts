import { Item } from '../item';

it('implements optimistic concurrency control', async () => {
    // Create an instance of an item
    const item = Item.build({
        name: 'artifact',
        startPrice: 50,
        userId: '1234',
        description: 'text',
    });

    // Save the item to the database
    await item.save();

    //  fetch the item twice
    const firstInstance = await Item.findById(item.id);
    const secondInstance = await Item.findById(item.id);

    //make two separate changes to the item we fetched
    firstInstance?.set({ startPrice: 100 });
    secondInstance?.set({ startPrice: 150 });

    // save the first fetched item
    await firstInstance?.save();

    // save the second fetched item;
    try {
        await secondInstance?.save();
    } catch (err) {
        return;
    }

    throw new Error('Should not get this point');
});

it('increments the version number on multiple saves', async () => {
    // Create an instance of an item
    const item = Item.build({
        name: 'artifact',
        startPrice: 59,
        userId: '1234',
        description: 'text',
    });

    // Save the item to the database
    await item.save();
    expect(item.version).toEqual(0);
    await item.save();
    expect(item.version).toEqual(1);
    await item.save();
    expect(item.version).toEqual(2);
});
