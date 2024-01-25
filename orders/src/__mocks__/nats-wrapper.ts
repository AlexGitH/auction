export const natsWrapper = {
    //fake client object for TicketCreatedPublisher constructor
    client: {
        publish: jest
            .fn()
            .mockImplementation(
                (subject: string, data: string, callback: () => void) => {
                    callback();
                }
            ),
    },
    connect() {
        return Promise.resolve();
    },
};
