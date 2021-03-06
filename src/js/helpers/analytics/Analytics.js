/**
 * Analytics.js
 * Created by Kevin Li 2/2/18
 */

import kGlobalConstants from 'GlobalConstants';

const Analytics = {
    _prefix: 'USAspending - ',
    _execute(...args) {
        if (this.isDAP && !kGlobalConstants.DEV && !kGlobalConstants.QAT) {
            window.gas(...args);
        }
        if (this.isGA) {
            window.ga(...args);
        }
        return null;
    },
    get isDAP() {
        return Boolean(window.gas && typeof window.gas === 'function');
    },
    get isGA() {
        return Boolean(window.ga && typeof window.ga === 'function');
    },
    event(args) {
        if (!args.category || !args.action) {
            return;
        }
        this._execute(
            'send',
            'event',
            `${this._prefix}${args.category}`,
            args.action,
            args.label || undefined,
            args.value || undefined,
            args.nonInteraction || undefined
        );
    },
    pageview(path) {
        this._execute(
            'send',
            'pageview',
            path
        );
    }
};

// no hack approaches allowed
Object.freeze(Analytics);

export default Analytics;
