/**
 * MigrationEngine.js
 * Created by Kevin Li 4/5/18
 */

import currentVersion from '../_saveVersion';

import lastMigration from './migrations/2018-04-05__migration';

function _migrate(data, migration) {
    return migration.migrate(data);
}

function start(data) {
    if (data._version === currentVersion) {
        // this is the latest version, don't do anything
        return data;
    }

    // migrate the data up to the current version
    return _migrate(data, lastMigration);
}

const MigrationEngine = { start };

export default MigrationEngine;
