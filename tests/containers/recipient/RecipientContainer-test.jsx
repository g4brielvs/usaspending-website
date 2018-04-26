import React from 'react';
import { mount, shallow } from 'enzyme';
import { RecipientContainer } from 'containers/recipient/RecipientContainer';

import BaseRecipientOverview from 'models/v2/recipient/BaseRecipientOverview';

import { redux } from './mockRedux';
import * as mockHelper from './mockRecipientHelper';
import { mockParent } from '../../models/recipient/mockData';

// mock the recipient helper
jest.mock('helpers/recipientHelper', () => require('./mockRecipientHelper'));

// mock the child component by replacing it with a function that returns a null element
jest.mock('components/recipient/RecipientPage', () => jest.fn(() => null));

describe('RecipientContainer', () => {
    describe('loadRecipientOverview', () => {
        it('should make an API call', () => {
            const container = shallow(
                <RecipientContainer
                    {...redux} />
            );

            container.instance().loadRecipientOverview('xxx');
            expect(mockHelper.loadRecipientDuns).toHaveBeenCalledTimes(1);
            expect(mockHelper.loadRecipientDuns).toHaveBeenLastCalledWith('xxx');
        });
        it('should call parseRecipient when the API returns with data', async () => {
            const container = shallow(
                <RecipientContainer
                    {...redux} />
            );
            container.instance().parseRecipient = jest.fn();

            container.instance().loadRecipientOverview('xxx');
            await container.instance().request.promise;

            expect(container.instance().parseRecipient).toHaveBeenCalledTimes(1);
        });
    });
    describe('parseRecipient', () => {
        it('should create an object with BaseRecipientOverview as its prototype', () => {
            const mockRedux = Object.assign({}, redux, {
                setSelectedRecipient: jest.fn()
            });
            const container = shallow(
                <RecipientContainer
                    {...mockRedux} />
            );

            container.instance().parseRecipient(mockParent);
            const parsed = mockRedux.setSelectedRecipient.mock.calls[0][0];
            expect(BaseRecipientOverview.isPrototypeOf(parsed)).toBeTruthy();
        });
        it('should call the setSelectedRecipient Redux action', () => {
            const mockRedux = Object.assign({}, redux, {
                setSelectedRecipient: jest.fn()
            });
            const container = shallow(
                <RecipientContainer
                    {...mockRedux} />
            );

            container.instance().parseRecipient(mockParent);
            expect(mockRedux.setSelectedRecipient).toHaveBeenCalledTimes(1);
        });
    });
});
