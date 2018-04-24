/**
 * recipientReducer.js
 * Created by Kevin Li 4/23/18
 **/

export const initialState = {
    recipient: null
};

const recipientReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'RECIPIENT_SET_SELECTED_RECIPIENT': {
            return Object.assign({}, state, {
                recipient: action.recipient
            });
        }
        default:
            return state;
    }
};

export default recipientReducer;
