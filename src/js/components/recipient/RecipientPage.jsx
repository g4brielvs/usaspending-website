/**
 * RecipientPage.jsx
 * Created by Kevin Li 4/20/18
 */

import React from 'react';
import PropTypes from 'prop-types';
import Header from 'components/sharedComponents/header/Header';
import StickyHeader from 'components/sharedComponents/stickyHeader/StickyHeader';
import Footer from 'components/sharedComponents/Footer';

import ErrorMessage from 'components/sharedComponents/Error';

import RecipientContent from './RecipientContent';

const propTypes = {
    loading: PropTypes.bool,
    error: PropTypes.bool
};

const RecipientPage = (props) => {
    let content = null;
    if (props.loading) {
        content = (
            <ErrorMessage
                title="Loading..."
                message="" />
        );
    }
    else if (props.error) {
        content = (
            <ErrorMessage
                title="Invalid Recipient"
                message="The recipient ID provided is invalid. Please check the ID and try again." />
        );
    }
    else {
        content = (
            <RecipientContent
                {...props} />
        );
    }

    return (
        <div className="usa-da-recipient-page">
            <Header />
            <StickyHeader>
                <div className="sticky-header__title">
                    <h1 tabIndex={-1} id="main-focus">
                        Recipient Profile
                    </h1>
                </div>
            </StickyHeader>
            <main
                id="main-content"
                className="main-content">
                {content}
            </main>
            <Footer />
        </div>
    );
};

RecipientPage.propTypes = propTypes;

export default RecipientPage;
