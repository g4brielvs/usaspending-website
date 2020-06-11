import React, { useState } from 'react';
import PropTypes from 'prop-types';

import GlobalConstants from "GlobalConstants";
import { asstAwardTypesWithSimilarAwardAmountData } from 'dataMapping/award/awardAmountsSection';
import RectanglePercentViz from 'components/award/financialAssistance/RectanglePercentViz';

import { getTooltipPropsByAwardTypeAndSpendingCategory } from '../Tooltips';
import NormalChart from './NormalChart';
import ExceedsCurrentChart from './ExceedsCurrentChart';
import ExceedsPotentialChart from './ExceedsPotentialChart';
import NoResultsMessage from '../../../../sharedComponents/NoResultsMessage';
import GrantChart from './GrantChart';
import { AWARD_OVERVIEW_AWARD_AMOUNTS_SECTION_PROPS } from '../../../../../propTypes/index';

const propTypes = {
    awardType: PropTypes.string,
    awardOverview: AWARD_OVERVIEW_AWARD_AMOUNTS_SECTION_PROPS,
    spendingScenario: PropTypes.string
};

// eslint-disable-next-line import/prefer-default-export
export const useTooltips = (arrayOfTooltips) => {
    const [activeTooltip, setActiveTooltip] = useState('');
    return [
        activeTooltip,
        () => setActiveTooltip(''),
        ...arrayOfTooltips.map((tt) => () => setActiveTooltip(tt))
    ];
};

const isCaresActReleased = GlobalConstants.CARES_ACT_RELEASED;

const AwardAmountsChart = ({ awardType, awardOverview, spendingScenario }) => {
    const renderChartBySpendingScenario = (
        scenario = spendingScenario,
        type = awardType,
        awardAmounts = awardOverview) => {
        switch (scenario) {
            case "exceedsBigger":
                return (
                    <ExceedsCurrentChart awardType={type} awardAmounts={awardAmounts} />
                );
            case "exceedsBiggest":
                return (
                    <ExceedsPotentialChart awardType={type} awardAmounts={awardAmounts} />
                );
            case "normal": {
                const hasFileC = awardAmounts._fileCObligated > 0;
                const chartProps = {
                    denominator: {
                        className: `${awardType}-potential`,
                        rawValue: awardAmounts._baseAndAllOptions,
                        value: awardAmounts.baseAndAllOptionsAbbreviated,
                        color: (isCaresActReleased && hasFileC) ? '#AAC6E2' : `#ececec`,
                        text: awardType === 'idv'
                            ? "Combined Potential Award Amounts"
                            : "Potential Award Amount",
                        tooltipData: getTooltipPropsByAwardTypeAndSpendingCategory(awardType, 'potential', awardAmounts)
                    },
                    numerator: {
                        labelSortOrder: 1,
                        labelPosition: 'bottom',
                        className: `${awardType}-current`,
                        tooltipData: getTooltipPropsByAwardTypeAndSpendingCategory(awardType, 'current', awardAmounts),
                        rawValue: awardAmounts._baseExercisedOptions,
                        denominatorValue: awardAmounts._baseAndAllOptions,
                        value: awardAmounts.baseExercisedOptionsAbbreviated,
                        text: awardType === 'idv'
                            ? "Combined Current Award Amounts"
                            : "Current Award Amount",
                        color: (isCaresActReleased && hasFileC) ? '#558EC6' : `#d8d8d8`,
                        children: [
                            {
                                labelSortOrder: 0,
                                labelPosition: 'top',
                                className: `${awardType}-obligated`,
                                rawValue: awardAmounts._totalObligation,
                                denominatorValue: awardAmounts._baseExercisedOptions,
                                value: awardAmounts.totalObligationAbbreviated,
                                text: awardType === 'idv'
                                    ? "Combined Obligated Amounts"
                                    : "Obligated Amount",
                                color: (isCaresActReleased && hasFileC) ? '#0A2F5A' : `#4773aa`,
                                tooltipData: getTooltipPropsByAwardTypeAndSpendingCategory(awardType, 'obligated', awardAmounts)
                            }
                        ]
                    }
                };
                if (hasFileC) {
                    // eslint-disable-next-line no-multi-assign
                    chartProps.numerator.children = [{
                        ...chartProps.numerator.children[0],
                        children: [
                            {
                                labelSortOrder: 1,
                                labelPosition: 'top',
                                className: `${awardType}-file-c-obligated`,
                                tooltipData: getTooltipPropsByAwardTypeAndSpendingCategory(awardType, 'fileCObligated', awardAmounts),
                                rawValue: awardAmounts._fileCObligated,
                                denominatorValue: awardAmounts._totalObligation,
                                value: awardAmounts.fileCObligatedAbbreviated,
                                text: 'COVID-19 Response Obligations Amount',
                                color: `#B699C6`,
                                children: [{
                                    labelSortOrder: 0,
                                    labelPosition: 'bottom',
                                    className: `${awardType}-file-c-outlay`,
                                    tooltipData: getTooltipPropsByAwardTypeAndSpendingCategory(awardType, 'fileCOutlay', awardAmounts),
                                    denominatorValue: awardAmounts._fileCObligated,
                                    rawValue: awardAmounts._fileCOutlay,
                                    value: awardAmounts.fileCOutlayAbbreviated,
                                    text: 'COVID-19 Response Outlay Amount',
                                    color: `#6E338E`
                                }]
                            }
                        ]
                    }];
                }
                return (
                    <RectanglePercentViz {...chartProps} />
                );
            }
            default:
                return (
                    <div className="results-table-message-container">
                        <NoResultsMessage title="Chart Not Available" message="Data in this instance is not suitable for charting" />
                    </div>
                );
        }
    };

    const renderChartByAwardType = (awardAmounts = awardOverview, type = awardType, scenario = spendingScenario) => {
        const isNormal = scenario === 'normal';
        if (asstAwardTypesWithSimilarAwardAmountData.includes(type) && isNormal) {
            const showFileC = awardAmounts._fileCObligated > 0 && GlobalConstants.CARES_ACT_RELEASED;
            const chartProps = {
                denominator: {
                    className: `asst-total-funding`,
                    rawValue: awardAmounts._totalFunding,
                    value: awardAmounts.totalFundingAbbreviated,
                    color: `#FFF`,
                    text: `Total Funding`,
                    tooltipData: getTooltipPropsByAwardTypeAndSpendingCategory(awardType, 'totalFunding', awardAmounts)
                },
                numerator: {
                    className: `asst-obligation`,
                    labelSortOrder: 0,
                    labelPosition: 'top',
                    tooltipData: getTooltipPropsByAwardTypeAndSpendingCategory(awardType, 'obligated', awardAmounts),
                    rawValue: awardAmounts._totalObligation,
                    denominatorValue: awardAmounts._totalFunding,
                    value: awardAmounts.totalObligationAbbreviated,
                    text: 'Obligated Amount',
                    color: `#4773aa`
                },
                numerator2: {
                    className: awardAmounts._nonFederalFunding > 0 ? `asst-non-federal-funding` : `asst-nff-zero`,
                    labelSortOrder: 1,
                    labelPosition: 'bottom',
                    rawValue: awardAmounts._nonFederalFunding,
                    value: awardAmounts.nonFederalFundingAbbreviated,
                    color: `#47AAA7`,
                    text: "Non Federal Funding",
                    tooltipData: getTooltipPropsByAwardTypeAndSpendingCategory(awardType, 'nonFederalFunding', awardAmounts)
                }
            };
            if (showFileC) {
                // eslint-disable-next-line no-multi-assign
                chartProps.numerator.children = [
                    {
                        labelSortOrder: 1,
                        labelPosition: 'top',
                        className: `asst-file-c-obligated`,
                        tooltipData: getTooltipPropsByAwardTypeAndSpendingCategory(awardType, 'fileCObligated', awardAmounts),
                        rawValue: awardAmounts._fileCObligated,
                        denominatorValue: awardAmounts._totalObligation,
                        value: awardAmounts.fileCObligatedAbbreviated,
                        text: 'COVID-19 Response Obligations Amount',
                        color: `#B699C6`,
                        children: [{
                            labelSortOrder: 0,
                            labelPosition: 'bottom',
                            className: `asst-file-c-outlay`,
                            tooltipData: getTooltipPropsByAwardTypeAndSpendingCategory(awardType, 'fileCOutlay', awardAmounts),
                            denominatorValue: awardAmounts._fileCObligated,
                            rawValue: awardAmounts._fileCOutlay,
                            value: awardAmounts.fileCOutlayAbbreviated,
                            text: 'COVID-19 Response Outlay Amount',
                            color: `#6E338E`
                        }]
                    }
                ];
            }
            return (
                <RectanglePercentViz {...chartProps} />
            );
        }
        else if (type === 'loan' && isNormal) {
            const hasFileC = awardAmounts._fileCObligated > 0;
            const propsWithoutFileC = {
                numerator: {
                    rawValue: awardAmounts._subsidy,
                    value: awardAmounts.subsidyAbbreviated,
                    text: 'Original Subsidy Cost',
                    tooltipData: getTooltipPropsByAwardTypeAndSpendingCategory('loan', 'subsidy', awardAmounts),
                    color: '#F5A623'
                },
                denominator: {
                    rawValue: awardAmounts._faceValue,
                    value: awardAmounts.faceValueAbbreviated,
                    text: 'Face Value of Direct Loan',
                    tooltipData: getTooltipPropsByAwardTypeAndSpendingCategory('loan', 'faceValue', awardAmounts),
                    color: '#fff'
                }
            };
            const props = hasFileC
                ? {
                    ...propsWithoutFileC,
                    numerator2: {
                        rawValue: awardAmounts._fileCObligated,
                        value: awardAmounts.fileCObligatedAbbreviated,
                        text: 'COVID-19 Response Obligations Amount',
                        color: '#B699C6',
                        tooltipData: getTooltipPropsByAwardTypeAndSpendingCategory('loan', 'fileCObligated', awardAmounts)
                    },
                    numerator3: {
                        rawValue: awardAmounts._fileCOutlay,
                        value: awardAmounts.fileCOutlayAbbreviated,
                        text: 'COVID-19 Response Outlay Amount',
                        color: '#6E338E',
                        tooltipData: getTooltipPropsByAwardTypeAndSpendingCategory('loan', 'fileCOutlay', awardAmounts)
                    }
                }
                : propsWithoutFileC;
            return <RectanglePercentViz {...props} />;
        }
        else if (type === 'idv' || type === 'contract') {
            return renderChartBySpendingScenario(scenario);
        }
        return (
            <div className="results-table-message-container">
                <NoResultsMessage title="Chart Not Available" message="Data in this instance is not suitable for charting" />
            </div>
        );
    };

    const visualization = renderChartByAwardType(awardOverview, awardType, spendingScenario);

    return (
        <React.Fragment>
            {visualization}
        </React.Fragment>
    );
};

AwardAmountsChart.propTypes = propTypes;

export default AwardAmountsChart;
