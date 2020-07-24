/**
 * redirectModalActions.js
 * Created by Lizzie Salita 2/22/18
 */

export const showModal = (url, modalType = 'redirect') => ({
    type: 'SHOW_MODAL',
    value: url,
    modalType
});

export const hideModal = () => ({
    type: 'HIDE_MODAL'
});
