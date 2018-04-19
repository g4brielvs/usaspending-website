import Joi from 'joi';
import migration from './migrations/2018-04-05__migration';

const mockedMigration = Object.create(migration);

const mockData = {
    version: '2017-11-21',
    
};

describe('Migration: 2018-04-05', () => {
    describe('migrate', () => {
        it('should run a previous migration if one is available and the filter versions do not match', () => {
            mockedMigration.prev = jest.fn();

        });
    });
});
