export const stripe = {
    charges: {
        create: jest
            .fn()
            .mockResolvedValue({id: 'test-id'}),
    },
    connect() { return Promise.resolve() },
};
