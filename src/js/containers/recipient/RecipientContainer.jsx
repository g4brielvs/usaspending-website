/**
 * RecipientContainer.jsx
 * Created by Kevin Li 4/20/18
 */

import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isCancel } from 'axios';

import BaseRecipientOverview from 'models/v2/recipient/BaseRecipientOverview';
import * as recipientActions from 'redux/actions/recipient/recipientActions';

import RecipientPage from 'components/recipient/RecipientPage';

require('pages/recipient/recipientPage.scss');

const mockData = {
    "name": "Recipient Name",
    "duns": "22222",
    "lei": "99999",
    "parent_name": "Recipient Name Holding Corp",
    "parent_duns": "12345",
    "location": {
        "address_line1": "200 Clarendon Street",
        "address_line2": "Suite 123",
        "address_line3": "Receiving Department",
        "city_name": "Boston",
        "state_code": "MA",
        "zip5": "02116",
        "location_country_code": "USA",
        "country_name": "UNITED STATES",
        "congressional_code": "07"
    },
    "business_categories": [
        "woman_owned_business",
        "sole_proprietorship"
    ],
    "amounts": {
        "fy": 2018,
        "total": 38412345.67,
        "average": 12345.67
    }
};

// const mockData = {
//     "name": "Recipient Name",
//     "duns": "12345",
//     "lei": "99999",
//     "parent_name": "Recipient Name",
//     "parent_duns": "12345",
//     "location": {
//         "address_line1": "200 Clarendon Street",
//         "address_line2": "Suite 123",
//         "address_line3": "Receiving Department",
//         "city_name": "Boston",
//         "state_code": "MA",
//         "zip5": "02116",
//         "location_country_code": "USA",
//         "country_name": "UNITED STATES",
//         "congressional_code": "07"
//     },
//     "business_categories": [
//         "woman_owned_business",
//         "sole_proprietorship"
//     ],
//     "amounts": {
//         "fy": 2018,
//         "total": 38412345.67,
//         "average": 12345.67
//     }
// };

const propTypes = {
    params: PropTypes.object,
    agency: PropTypes.object,
    setAgencyOverview: PropTypes.func
};

export class RecipientContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            error: false
        };

        this.request = null;
        this.updateRequest = null;
    }
    componentWillMount() {
        this.loadRecipientOverview(this.props.params.recipientId);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.params.recipientId !== nextProps.params.recipientId) {
            this.loadRecipientOverview(nextProps.params.recipientId);
        }
    }

    loadRecipientOverview(id) {
        if (this.request) {
            this.request.cancel();
        }

        this.setState({
            loading: true
        });

        setTimeout(() => {
            this.parseRecipient(mockData);
            this.setState({
                loading: false
            });
        }, 1000);
    }

    parseRecipient(data) {
        const recipient = Object.create(BaseRecipientOverview);
        recipient.populate(data);
        this.props.setSelectedRecipient(recipient);
    }

    render() {
        return (
            <RecipientPage
                loading={this.state.loading}
                error={this.state.error}
                recipient={this.props.recipient} />
        );
    }
}

export default connect(
    (state) => ({
        recipient: state.recipient.recipient
    }),
    (dispatch) => bindActionCreators(recipientActions, dispatch)
)(RecipientContainer);

RecipientContainer.propTypes = propTypes;
