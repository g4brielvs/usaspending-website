import recipientReducer, { initialState } from 'redux/reducers/recipient/recipientReducer';

import BaseRecipientOverview from 'models/v2/recipient/BaseRecipientOverview';

describe('recipientReducer', () => {
    describe('RECIPIENT_SET_SELECTED_RECIPIENT', () => {
        it('should update the state with the provided recipient', () => {
            const initial = recipientReducer(undefined, {});
            expect(initial).toEqual(initialState);

            const recipient = Object.create(BaseRecipientOverview);
            const action = {
                type: 'RECIPIENT_SET_SELECTED_RECIPIENT',
                recipient
            };
            const state = recipientReducer(action, initial);
            expect(state.recipient).toEqual(recipient);
        });
    });
});
