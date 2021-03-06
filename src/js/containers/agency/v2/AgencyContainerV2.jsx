/**
 * AgencyPage.jsx
 * Created by Maxwell Kendall 01/31/2020
 */

import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { startCase, snakeCase } from "lodash";
import {
    TooltipWrapper,
    Picker
} from 'data-transparency-ui';

import { setBudgetaryResources } from 'redux/actions/agencyV2/agencyV2Actions';
import { fetchBudgetaryResources } from 'helpers/agencyV2Helper';
import BaseAgencyBudgetaryResources from 'models/v2/agency/BaseAgencyBudgetaryResources';

import { agencyPageMetaTags } from 'helpers/metaTagHelper';
import { scrollToY } from 'helpers/scrollToHelper';
import * as FiscalYearHelper from 'helpers/fiscalYearHelper';
import { getBaseUrl } from 'helpers/socialShare';

import MetaTags from 'components/sharedComponents/metaTags/MetaTags';
import Header from 'containers/shared/HeaderContainer';
import Sidebar from 'components/sharedComponents/sidebar/Sidebar';
import StickyHeader from 'components/sharedComponents/stickyHeader/StickyHeader';
import Footer from 'containers/Footer';
import { LoadingWrapper } from 'components/sharedComponents/Loading';
import { defaultSortFy } from 'components/sharedComponents/pickers/FYPicker';
import ShareIcon from 'components/sharedComponents/stickyHeader/ShareIcon';

import AccountSpending from 'components/agency/v2/accountSpending/AccountSpending';
import Error from 'components/sharedComponents/Error';

require('pages/agency/v2/index.scss');

const scrollPositionOfSiteHeader = 96;

const TooltipComponent = () => (
    <div className="agency-v2-tt">
        <h4 className="tooltip__title">Coming Soon</h4>
        <p className="tooltip__text">The tooltip content for this section is currently under review.</p>
    </div>
);

// eslint-disable-next-line react/prop-types
const AgencySection = ({ section, icon = "chart-area", children }) => (
    <section id={`agency-v2-${snakeCase(section)}`} className={`body__section ${snakeCase(section)}`}>
        <div className="body__header">
            <div className="body__header-icon">
                <FontAwesomeIcon size="lg" icon={icon} />
            </div>
            <h3>{startCase(section)}</h3>
            <TooltipWrapper
                className="agency-v2-tt"
                icon="info"
                tooltipComponent={<TooltipComponent />} />
        </div>
        <hr />
        {children}
    </section>
);

const ComingSoon = () => (
    <div className="coming-soon-section">
        <h4>Coming Soon</h4>
        <p>This feature is currently under development.</p>
    </div>
);

const propTypes = {
    params: PropTypes.shape({
        agencyId: PropTypes.string
    })
};

export const AgencyProfileV2 = () => {
    const { agencyId } = useParams();
    const dispatch = useDispatch();
    const [activeSection, setActiveSection] = useState('overview');
    const [selectedFy, setSelectedFy] = useState(FiscalYearHelper.defaultFiscalYear());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        // request budgetary resources data for this agency
        const budgetaryResourcesRequest = fetchBudgetaryResources(agencyId);
        budgetaryResourcesRequest.promise
            .then((res) => {
                // parse the response using our data model
                setLoading(false);
                const budgetaryResources = Object.create(BaseAgencyBudgetaryResources);
                budgetaryResources.populate(res.data);
                // store the data model object in Redux
                dispatch(setBudgetaryResources(budgetaryResources));
            }).catch((err) => {
                setError(true);
                setLoading(false);
                console.error(err);
            });
    }, [agencyId]);

    const componentByAgencySection = {
        overview: <ComingSoon />,
        account_spending: <AccountSpending fy={`${selectedFy}`} agencyId={agencyId} />,
        award_spending: <ComingSoon />,
        sub_agency_spending: <ComingSoon />,
        award_recipients: <ComingSoon />,
        top_5_award_dimensions: <ComingSoon />
    };

    const jumpToSection = (section = '') => {
        // we've been provided a section to jump to
        // check if it's a valid section
        const matchedSection = Object.keys(componentByAgencySection).find((key) => key === section);

        if (!matchedSection) {
            // no matching section
            return;
        }

        // scroll to the correct section
        const sectionDom = document.querySelector(`#agency-v2-${snakeCase(section)}`);

        if (!sectionDom) {
            return;
        }
        if (activeSection === 'overview') {
            scrollToY(sectionDom.offsetTop - 150, 700);
        }
        else {
            // scrollY set to the top of the section, subtracting the height of sticky elements + 20px of margin
            scrollToY(sectionDom.offsetTop - 86, 700);
        }

        setActiveSection(matchedSection);
    };

    const fyOptions = FiscalYearHelper.allFiscalYears(FiscalYearHelper.earliestExplorerYear)
        .map((year) => {
            const onClickHandler = () => setSelectedFy(year);
            return {
                name: `${year}`,
                value: year,
                onClick: onClickHandler
            };
        })
        .sort((a, b) => defaultSortFy(a.value, b.value));

    const slug = `agency_v2/${agencyId}`;

    return (
        <div className="usa-da-agency-page-v2">
            <MetaTags {...agencyPageMetaTags} />
            <Header />
            <StickyHeader>
                <>
                    <div className="sticky-header__title">
                        <h1 tabIndex={-1} id="main-focus">
                            Agency Profile v2
                        </h1>
                    </div>
                    <div className="sticky-header__toolbar">
                        <span className="fy-picker-label">Filter</span>
                        <div className="fiscal-year-container">
                            <Picker
                                sortFn={defaultSortFy}
                                icon={<FontAwesomeIcon icon="calendar-alt" />}
                                selectedOption={`${selectedFy}`}
                                options={fyOptions} />
                            <span>Fiscal Year</span>
                        </div>
                        <hr />
                        <ShareIcon
                            slug={slug}
                            email={{
                                // TODO - add agency name when the data is available
                                subject: 'USAspending.gov Agency Profile: ',
                                body: `View the spending activity of this agency on USAspending.gov: ${getBaseUrl(slug)}`
                            }} />
                        <div className="sticky-header__toolbar-item">
                            <button className="sticky-header__button">
                                <FontAwesomeIcon icon="download" />
                            </button>
                            <span>Download</span>
                        </div>
                    </div>
                </>
            </StickyHeader>
            <LoadingWrapper isLoading={loading} >
                <main id="main-content" className="main-content usda__flex-row">
                    <div className="sidebar usda__flex-col">
                        <Sidebar
                            pageName="agency-v2"
                            fixedStickyBreakpoint={scrollPositionOfSiteHeader}
                            active={activeSection}
                            jumpToSection={jumpToSection}
                            detectActiveSection={setActiveSection}
                            sections={Object.keys(componentByAgencySection).map((section) => ({
                                section: snakeCase(section),
                                label: startCase(section)
                            }))} />
                    </div>
                    {error &&
                        <div className="body usda__flex-col">
                            <Error />
                        </div>}
                    {!error &&
                        <div className="body usda__flex-col">
                            {Object.keys(componentByAgencySection).map((section) => (
                                <AgencySection key={section} section={section} >
                                    {componentByAgencySection[section]}
                                </AgencySection>
                            ))}
                        </div>
                    }
                </main>
            </LoadingWrapper>
            <Footer />
        </div>
    );
};

AgencyProfileV2.propTypes = propTypes;

export default AgencyProfileV2;
