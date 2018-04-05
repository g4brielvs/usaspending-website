/**
 * BaseSavedSearch.js
 * Created by Kevin Li 4/5/18
 */

import currentVersion from './_saveVersion';

import MigrationEngine from './migrationEngine/MigrationEngine';

import BaseSavedView from './BaseSavedView';
import BaseSavedFilters from './BaseSavedFilters';

const BaseSavedSearch = {
    populate(redux) {
        this.version = currentVersion;

        this.view = Object.create(BaseSavedView);
        this.view.populate(redux.searchView);

        this.filters = Object.create(BaseSavedFilters);
        this.filters.populate(redux.filters);
    },
    restore(response) {
        let data = response;
        if (data.version !== currentVersion) {
            data = MigrationEngine.start(response);
        }

        return {
            searchView: BaseSavedView.restore(data.view),
            filters: BaseSavedFilters.restore(data.filters)
        };
    }
};

export default BaseSavedSearch;
