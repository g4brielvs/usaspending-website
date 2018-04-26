import { mockParent } from '../../models/recipient/mockData';

export const loadRecipientDuns = jest.fn(() => ({
    promise: new Promise((resolve) => {
        process.nextTick(() => {
            resolve({
                data: mockParent
            });
        });
    }),
    cancel: jest.fn()
}));
