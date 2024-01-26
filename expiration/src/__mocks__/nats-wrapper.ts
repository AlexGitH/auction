export const natsWrapper = {
    //fake client object for ItemCreatedPublisher constructor
    client: {
        publish: jest
            .fn()
            .mockImplementation(
                (subject: string, data: string, callback: () => void) => {
                    callback();
                }
            ),
        // publish: (subject: string, data: string, callback: () => void) => callback(),
    },
    connect() {
        return Promise.resolve();
    },
};
