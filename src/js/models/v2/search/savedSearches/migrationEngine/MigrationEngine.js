/**
 * MigrationEngine.js
 * Created by Kevin Li 4/5/18
 */

import currentVersion from '../_saveVersion';

import lastMigration from './migrations/2018-04-20__migration';

function _migrate(data, migration) {
    return migration.migrate(data);
}

function start(data) {
    if (data.version === this._currentVersion) {
        // this is the latest version, don't do anything
        return data;
    }

    // migrate the data up to the current version
    return _migrate(data, this._lastMigration);
}

const MigrationEngine = {
    _currentVersion: currentVersion,
    _lastMigration: lastMigration,
    start
};

export default MigrationEngine;
