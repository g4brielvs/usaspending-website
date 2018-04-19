/**
 * MigrationEngine-test.js
 * Created by Kevin Li 4/18/18
 */

import MigrationEngine from 'models/v2/search/savedSearches/migrationEngine/MigrationEngine';

// normally migration engine is used directly, but we will create a new object with
// the original engine as its prototype in order to mock its migrations
const engine = Object.create(MigrationEngine);
const mockMigration = {
    prev: jest.fn(),
    inboundVersion: '1900-01-01',
    migrate: jest.fn(() => ({
        field: 'mockData'
    }))
};
engine._lastMigration = mockMigration;
engine._currentVersion = '1900-01-01';

const mockInbound = {
    version: '1900-01-01',
    filters: {},
    view: {}
};

describe('MigrationEngine', () => {
    beforeEach(() => {
        // reset the migration counter
        mockMigration.migrate.mockClear();
    });

    describe('start', () => {
        it('should just return the input if the inbound data is the latest version', () => {
            const output = engine.start(mockInbound);
            expect(output).toEqual(mockInbound);
            expect(mockMigration.migrate).toHaveBeenCalledTimes(0);
        });
        it('should run the internal _migrate function if the inbound data does not match the latest version', () => {
            const oldInbound = Object.assign({}, mockInbound, {
                version: '1899-12-31'
            });

            engine.start(oldInbound);
            // all _migrate does is call the migration's migrate function
            expect(mockMigration.migrate).toHaveBeenCalledTimes(1);
        });
        it('should output an object with the latest version when a migration is run', () => {
            const oldInbound = Object.assign({}, mockInbound, {
                version: '1899-12-31'
            });

            const output = engine.start(oldInbound);
            expect(output).toEqual({
                field: 'mockData'
            });
        });
    });
});
