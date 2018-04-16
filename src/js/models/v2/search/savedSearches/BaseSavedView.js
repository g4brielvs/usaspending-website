/**
 * BaseSavedView.js
 * Created by Kevin Li 4/5/18
 */

const BaseSavedView = {
    populate(data) {
        this.subaward = data.subaward || false;
    },
    restore(data) {
        // regenerate the Redux stores
        return {
            subaward: data.subaward || false
        };
    }
};

export default BaseSavedView;
