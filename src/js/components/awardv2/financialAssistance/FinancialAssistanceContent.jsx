/**
 * FinancialAssistanceContent.jsx
 * Created by David Trinh 10/9/2018
 **/

import React from 'react';
import PropTypes from 'prop-types';

import { glossaryLinks } from 'dataMapping/search/awardType';
import AwardRecipient from '../shared/overview/AgencyRecipient';
import AwardDates from '../shared/overview/AwardDates';
import { AwardPageWrapper, AwardSection } from '../shared';
import ComingSoonSection from "../shared/ComingSoonSection";
import AwardAmounts from "../contract/AwardAmounts";

const propTypes = {
    awardId: PropTypes.string,
    overview: PropTypes.object,
    jumpToSection: PropTypes.func
};

const overviewProperties = [
    "id",
    "generatedId",
    "_totalObligation", // obligation
    "_baseExercisedOptions", // current
    "_baseAndAllOptions", // potential
    "totalObligation",
    "totalObligationFormatted",
    "baseExercisedOptions",
    "baseExercisedOptionsFormatted",
    "baseAndAllOptions",
    "baseAndAllOptionsFormatted"
];

/**
 * totalObligation // obligated
 * nonFederalFunding // current
 * totalFunding // potential
 **/

// Does this need to go in a model or a data mapping?
const awardAmountValueByOverviewKey = {
    _totalObligation: "_obligation",
    totalObligation: "obligationFormatted",
    totalObligationFormatted: "obligation",
    _nonFederalFunding: "_combinedCurrentAwardAmounts",
    nonFederalFunding: "combinedCurrentAwardAmountsFormatted",
    nonFederalFundingFormatted: "combinedCurrentAwardAmounts",
    _totalFunding: "_combinedPotentialAwardAmounts",
    totalFunding: "combinedPotentialAwardAmountsFormatted",
    totalFundingFormatted: "PotentialAwardAmounts"
};

const defaultTooltipProps = {
    controlledProps: {
        isControlled: true,
        isVisible: false,
        closeCurrentTooltip: () => console.log("close tooltip"),
        showTooltip: () => console.log("open tooltip")
    }
};

export default class FinancialAssistanceContent extends React.Component {
    render() {
        const { typeDescription, id } = this.props.overview;
        const link = `/#/award_v2/${this.props.awardId}?glossary=${glossaryLinks[this.props.overview.type]}`;
        const awardAmountsProps = overviewProperties
            .reduce((acc, key) => ({
                ...acc,
                [awardAmountValueByOverviewKey[key] || key]: this.props.overview[key]
            }), { _obligation: 0, _combinedCurrentAwardAmounts: 0, _combinedPotentialAwardAmounts: 0 });
        // TODO: Determine if we should label with FAIN/ URI instead of ID
        return (
            <AwardPageWrapper
                type="financial-assistance"
                glossaryLink={link}
                awardTypeDescription={typeDescription}
                identifier={id}>
                <AwardSection type="row" id="award-overview" className="award-overview">
                    <AwardRecipient
                        jumpToSection={this.props.jumpToSection}
                        awardingAgency={this.props.overview.awardingAgency}
                        category={this.props.overview.category}
                        recipient={this.props.overview.recipient} />
                    <AwardSection type="column" className="award-amountdates">
                        <AwardDates overview={this.props.overview} />
                    </AwardSection>
                </AwardSection>
                <AwardSection type="row">
                    <AwardSection type="column">
                        <AwardAmounts
                            awardAmountsProps={awardAmountsProps}
                            tooltipProps={defaultTooltipProps} />
                    </AwardSection>
                    <ComingSoonSection title="Description" includeHeader />
                </AwardSection>
            </AwardPageWrapper>
        );
    }
}
FinancialAssistanceContent.propTypes = propTypes;
