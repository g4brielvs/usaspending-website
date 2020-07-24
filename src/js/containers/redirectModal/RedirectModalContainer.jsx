/**
 * RedirectModalContainer.jsx
 * Created by Lizzie Salita 2/22/18
 */

import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as redirectModalActions from 'redux/actions/redirectModal/redirectModalActions';
import CovidModalContainer from 'containers/covid19/CovidModalContainer';

import RedirectModal from 'components/sharedComponents/RedirectModal';

const propTypes = {
    globalModal: PropTypes.object,
    hideModal: PropTypes.func
};

export class GlobalModalContainer extends React.Component {
    render() {
        if (this.props.globalModal.modalType === 'redirect') {
            return (
                <RedirectModal
                    mounted={this.props.globalModal.display}
                    hideModal={this.props.hideModal}
                    url={this.props.globalModal.url} />
            );
        }
        if (this.props.globalModal.modalType === 'covid19') {
            return (
                <CovidModalContainer
                    showModal={this.props.globalModal.display}
                    hideModal={this.props.hideModal} />
            );
        }
        return null;
    }
}

GlobalModalContainer.propTypes = propTypes;

export default connect(
    (state) => ({
        globalModal: state.globalModal
    }),
    (dispatch) => bindActionCreators(redirectModalActions, dispatch)
)(GlobalModalContainer);
