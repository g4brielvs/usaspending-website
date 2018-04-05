/**
 * BaseSavedView.js
 * Created by Kevin Li 4/5/18
 */

const BaseSavedView = {
    populate(data) {
        this.activeTab = data.type || 'table';
        this.subaward = data.subaward || false;
    },
    restore(data) {
        // regenerate the Redux stores
        return {
            type: data.activeTab,
            subaward: data.subaward || false
        };
    }
};

export default BaseSavedView;
