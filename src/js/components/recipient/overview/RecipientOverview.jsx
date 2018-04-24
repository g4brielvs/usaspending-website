/**
 * RecipientOverview.jsx
 * Created by Kevin Li 4/24/18
 */

import React from 'react';

export default class RecipientOverview extends React.Component {
    render() {
        return (
            <div
                className="overview"
                id="recipient-overview">
                <h3 className="overview__title">{this.props.recipient.name}</h3>
                <hr className="results-divider" />
            </div>
        );
    }
}