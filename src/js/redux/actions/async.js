import { apiRequest } from 'helpers/apiRequest';

const fetchDefCodes = apiRequest({
    url: 'v2/references/def_codes/'
});

export const reduxThunkExample = (test) => {
    return (dispatch) => {
        console.log('test', test);
        dispatch({ type: 'SET_ASYNC', payload: true });
        return fetchDefCodes.promise
            .then((resp) => {
                console.log('resp', resp);
                dispatch({ type: 'SET_DEF_CODES', defCodes: resp.data.codes });
                dispatch({ type: 'SET_ASYNC', payload: false });
            });
    }
};
