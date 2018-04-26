/**
 * recipientHelper.js
 * Created by Kevin Li 4/26/18
 */

import Axios, { CancelToken } from 'axios';
import kGlobalConstants from 'GlobalConstants';


export const loadRecipientDuns = (duns) => {
    const source = CancelToken.source();
    return {
        promise: Axios.request({
            url: `v2/recipient/duns/${duns}/`,
            baseURL: kGlobalConstants.API,
            method: 'get',
            cancelToken: source.token
        }),
        cancel() {
            source.cancel();
        }
    };
};
