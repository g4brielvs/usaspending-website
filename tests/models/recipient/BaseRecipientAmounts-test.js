import BaseRecipientAmounts from 'models/v2/recipient/BaseRecipientAmounts';

import { mockChild } from './mockData';

describe('BaseRecipientAmounts', () => {
    describe('populate', () => {
        it('should remap the API response to the base model object', () => {
            const data = mockChild.amounts;
            const output = Object.create(BaseRecipientAmounts);
            output.populate(data);

            expect(output.fy).toEqual('2018');
            expect(output._total).toEqual(38412345.67);
            expect(output._average).toEqual(12345.67);
        });
        it('should box the _total and _average fields to numbers', () => {
            const stringData = {
                fy: '2018',
                total: '1234',
                avarege: '2222'
            };
            const output = Object.create(BaseRecipientAmounts);
            output.populate(stringData);

            expect(typeof output._total).toEqual('number');
            expect(typeof output._average).toEqual('number');
        });
        it('should use default values when falsy values are returned by the API', () => {
            const falsyData = {
                fy: undefined,
                total: null
            };
            const output = Object.create(BaseRecipientAmounts);
            output.populate(falsyData);

            expect(output).toEqual({
                fy: '',
                _total: 0,
                _average: 0
            });
        });
    });

    describe('total', () => {
        it('should return the _total value formatted as a currency string', () => {
            const data = mockChild.amounts;
            const output = Object.create(BaseRecipientAmounts);
            output.populate(data);

            expect(output.total).toEqual('$38,412,346')
        });
    });

    describe('average', () => {
        it('should return the _average value formatted as a currency string', () => {
            const data = mockChild.amounts;
            const output = Object.create(BaseRecipientAmounts);
            output.populate(data);

            expect(output.average).toEqual('$12,346')
        });
    });
});
