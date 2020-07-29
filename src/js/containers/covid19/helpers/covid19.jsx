/**
 * covid19.jsx
 * Created by Jonathan Hill 06/10/20
 */

import React from 'react';
import PropTypes from "prop-types";

import OverviewContainer from 'containers/covid19/OverviewContainer';
import RecipientContainer from 'containers/covid19/recipient/RecipientContainer';

import AwardSpendingAgency from 'components/covid19/awardSpendingAgency/AwardSpendingAgency';
import BudgetCategories from 'components/covid19/budgetCategories/BudgetCategories';
import AwardQuestion from 'components/covid19/AwardQuestions';
import SpendingByCFDA from 'components/covid19/assistanceListing/SpendingByCFDA';

// [DEV-5734]
export const TooltipComponent = ({
    title = 'Coming Soon',
    TooltipContent = () => (
        <p className="tooltip__text">
            The tooltip content for this section is currently under review.
        </p>
    )
}) => (
    <div className="covid19-tt">
        <h4 className="tooltip__title">{title}</h4>
        <div className="tooltip__body">
            <TooltipContent />
        </div>
    </div>
);

TooltipComponent.propTypes = {
    title: PropTypes.string,
    TooltipContent: PropTypes.node
};

const totalSpendingText = (
    <div className="body__header-text">
      This section covers <strong>Total Spending</strong>
    </div>
);

const awardSpendingText = (
    <div className="body__header-text">
      This section covers <strong>Award Spending</strong>
    </div>
);

const totalSpendingTooltip = (
    <div>Content is coming soon</div>
);

const awardSpedingTooltip = (
    <div>Content is coming soon</div>
);

const OverviewTooltipContentLeft = () => (
    <p className="tooltip__text">
        The tooltip content for this section is currently under review.
    </p>
);

const OverviewTooltipContentRight = () => (
    <p className="tooltip__text">
        Total Spending, also known as Account Spending, refers to the totality of agency obligations and outlays, including agency expenses. Total Spending stands in contrast to Award Spending, which refers to money given through contracts or financial assistance to individuals, organizations, businesses, or state, local, or tribal governments.
    </p>
);

const TotalSpendingSectionTooltipContentLeft = () => (
    <p className="tooltip__text">
        The tooltip content for this section is currently under review.
    </p>
);

const TotalSpendingSectionTooltipContentRight = () => (
    <p className="tooltip__text">
        Total Spending, also known as Account Spending, refers to the totality of agency obligations and outlays, including agency expenses. Total Spending stands in contrast to Award Spending, which refers to money given through contracts or financial assistance to individuals, organizations, businesses, or state, local, or tribal governments.
    </p>
);

const RecipientSectionTooltipContentLeft = () => (
    <div className="tooltip__text">
        <p>
            This section shows a breakdown of award spending according to various recipient attributes.
        </p>
        <p>
            When counts appear next to the award type filters (e.g., &lsquo;All Awards&rsquo;, &lsquo;Grants&rsquo;, etc.), they refer to the number of recipients who have received that type of award. Note that the count associated with &lsquo;All Awards&rsquo; is not necessarily the sum of the remaining counts. For example, a given recipient may be counted individually across two award type categories (such as &lsquo;Loans&rsquo; and &lsquo;Contracts&rsquo;), but would only be counted once under &lsquo;All Awards&rsquo; (rather than twice, once for each of those two categories).
        </p>
        <p>
            When viewing table results:
        </p>
        <ul>
            <li>
                The &lsquo;Award Obligations&rsquo; column represents all award obligations, or promises of payment for awards, made by an agency or agencies.
            </li>
            <li>
                The &lsquo;Award Outlays&rsquo; column represents all award outlays, or actual payments for awards, made by an agency or agencies.
            </li>
            <li>
                The &lsquo;Award Obligations (Loan Subsidy Cost)&rsquo; and &lsquo;Award Outlays (Loan Subsidy Cost)&rsquo; columns represent unusual types of obligations and outlays. Loan Subsidy Cost is the calculated net present value of the loan or loan guarantee to the government, taking into account the size of the loan (i.e., its face value), interest rate, and the modeled risk of the recipient failing to pay back the loan in part or full.
            </li>
        </ul>
        <p>
            Loan Subsidy Cost does have direct budgetary impact and is factored into obligations and outlays when it is positive. Subsidy costs can be positive (indicating that the government is likely to lose money on the loan) or negative (indicating that the government is likely to make money on the loan). Loan Subsidy Cost should never be larger in absolute value terms than the Face Value of Loans itself. Administrative costs of running the loan or loan guarantee program itself are excluded from Loan Subsidy Cost calculations.
        </p>
        <ul>
            <li>
                The &lsquo;Face Value of Loans&rsquo; column represents the amount that agencies have directly issued (for direct loans) or facilitated by compensating the lender if the borrower defaults (for loan guarantees).
            </li>
        </ul>
        <p>
            From a budget perspective, Face Value of Loans is not considered federal spending, since it does not in itself represent a long-term cost to the government. As a result, Face Value of Loans is not included in any obligation or outlay figure.
        </p>
    </div>
);

const RecipientSectionTooltipContentRight = () => (
    <p className="tooltip__text">
        Award Spending refers to money given through contracts or financial assistance to individuals, organizations, businesses, or state, local, or tribal governments. It stands in contrast to Total Spending, also known as Account Spending, which refers to the totality of agency obligations and outlays, including agency expenses.
    </p>
);

const AgencySectionTooltipContentLeft = () => (
    <div className="tooltip__text">
        <p>
            This section shows a breakdown of award spending according to agency and sub-agency.
        </p>
        <p>
            When counts appear next to the award type filters (e.g., &lsquo;All Awards&rsquo;, &lsquo;Grants&rsquo;, etc.), they refer to the number of agencies who have given that type of award. Note that the count associated with &lsquo;All Awards&rsquo; is not necessarily the sum of the remaining counts. For example, a given agency may be counted individually across two award type categories (such as &lsquo;Loans&rsquo; and &lsquo;Contracts&rsquo;), but would only be counted once under &lsquo;All Awards&rsquo; (rather than twice, once for each of those two categories).
        </p>
        <p>
            When viewing table results:
        </p>
        <ul>
            <li>
                The &lsquo;Award Obligations&rsquo; column represents all award obligations, or promises of payment for awards, made by an agency or agencies.
            </li>
            <li>
                The &lsquo;Award Outlays&rsquo; column represents all award outlays, or actual payments for awards, made by an agency or agencies.
            </li>
            <li>
                <p>
                    The &lsquo;Award Obligations (Loan Subsidy Cost)&rsquo; and &lsquo;Award Outlays (Loan Subsidy Cost)&rsquo; columns represent unusual types of obligations and outlays. Loan Subsidy Cost is the calculated net present value of the loan or loan guarantee to the government, taking into account the size of the loan (i.e., its face value), interest rate, and the modeled risk of the recipient failing to pay back the loan in part or full.
                </p>
                <p>
                    Loan Subsidy Cost does have direct budgetary impact and is factored into obligations and outlays when it is positive. Subsidy costs can be positive (indicating that the government is likely to lose money on the loan) or negative (indicating that the government is likely to make money on the loan). Loan Subsidy Cost should never be larger in absolute value terms than the Face Value of Loans itself. Administrative costs of running the loan or loan guarantee program itself are excluded from Loan Subsidy Cost calculations.
                </p>
            </li>
            <li>
                <p>
                    The &lsquo;Face Value of Loans&rsquo; column represents the amount that agencies have directly issued (for direct loans) or facilitated by compensating the lender if the borrower defaults (for loan guarantees).
                </p>
                <p>
                    From a budget perspective, Face Value of Loans is not considered federal spending, since it does not in itself represent a long-term cost to the government. As a result, Face Value of Loans is not included in any obligation or outlay figure.
                </p>
            </li>
        </ul>
    </div>
);

const AgencySectionTooltipContentRight = () => (
    <p className="tooltip__text">
        Award Spending refers to money given through contracts or financial assistance to individuals, organizations, businesses, or state, local, or tribal governments. It stands in contrast to Total Spending, also known as Account Spending, which refers to the totality of agency obligations and outlays, including agency expenses.
    </p>
);

const AssistanceListingSectionTooltipContentLeft = () => (
    <div className="tooltip__text">
        <p>
            This section shows a breakdown of award spending according to CFDA Program --glossary entry.
        </p>
        <p>
            When counts appear next to the award type filters (e.g., &lsquo;All Assistance Awards&rsquo;, &lsquo;Grants&rsquo;, etc.), they refer to the number of CFDA Programs associated with that type of award. Note that the count associated with &lsquo;All Assistance Awards&rsquo; is not necessarily the sum of the remaining counts. For example, a given CFDA Program may be counted individually across two award type categories (such as &lsquo;Loans&rsquo; and &lsquo;Direct Payments&rsquo;), but would only be counted once under &lsquo;All Assistance Awards&rsquo; (rather than twice, once for each of those two categories).
        </p>
        <p>
            When viewing table results:
        </p>
        <ul>
            <li>
                The &lsquo;Award Obligations&rsquo; column represents all award obligations, or promises of payment for awards, made by an agency or agencies.
            </li>
            <li>
                The &lsquo;Award Outlays&rsquo; column represents all award outlays, or actual payments for awards, made by an agency or agencies.
            </li>
            <li>
                <p>
                    The &lsquo;Award Obligations (Loan Subsidy Cost)&rsquo; and &lsquo;Award Outlays (Loan Subsidy Cost)&rsquo; columns represent unusual types of obligations and outlays. Loan Subsidy Cost is the calculated net present value of the loan or loan guarantee to the government, taking into account the size of the loan (i.e., its face value), interest rate, and the modeled risk of the recipient failing to pay back the loan in part or full.
                </p>
                <p>
                    Loan Subsidy Cost does have direct budgetary impact and is factored into obligations and outlays when it is positive. Subsidy costs can be positive (indicating that the government is likely to lose money on the loan) or negative (indicating that the government is likely to make money on the loan). Loan Subsidy Cost should never be larger in absolute value terms than the Face Value of Loans itself. Administrative costs of running the loan or loan guarantee program itself are excluded from Loan Subsidy Cost calculations.
                </p>
            </li>
            <li>
                <p>
                    The &lsquo;Face Value of Loans&rsquo; column represents the amount that agencies have directly issued (for direct loans) or facilitated by compensating the lender if the borrower defaults (for loan guarantees).
                </p>
                <p>
                    From a budget perspective, Face Value of Loans is not considered federal spending, since it does not in itself represent a long-term cost to the government. As a result, Face Value of Loans is not included in any obligation or outlay figure.
                </p>
            </li>
        </ul>
    </div>
);

const AssistanceListingSectionTooltipContentRight = () => (
    <p className="tooltip__text">
        Award Spending refers to money given through contracts or financial assistance to individuals, organizations, businesses, or state, local, or tribal governments. It stands in contrast to Total Spending, also known as Account Spending, which refers to the totality of agency obligations and outlays, including agency expenses.
    </p>
);

// [DEV-5734]
export const componentByCovid19Section = () => ({
    overview: {
        icon: 'hand-holding-medical',
        component: <OverviewContainer />,
        headerText: totalSpendingText,
        headerTextTooltip: totalSpendingTooltip,
        showInMenu: true,
        showInMainSection: true,
        title: 'Overview',
        tooltipDataLeft: {
            title: 'Coming Soon',
            TooltipContent: OverviewTooltipContentLeft
        },
        tooltipDataRight: {
            title: 'Total Spending',
            TooltipContent: OverviewTooltipContentRight
        }
    },
    total_spending_by_budget_categories: {
        icon: 'cubes',
        component: <BudgetCategories />,
        headerText: totalSpendingText,
        headerTextTooltipooltip: totalSpendingTooltip,
        showInMenu: true,
        showInMainSection: true,
        title: 'Total Spending by Budget Categories',
        tooltipDataLeft: {
            title: 'Coming Soon',
            TooltipContent: TotalSpendingSectionTooltipContentLeft
        },
        tooltipDataRight: {
            title: 'Total Spending',
            TooltipContent: TotalSpendingSectionTooltipContentRight
        }
    },
    award_question: {
        component: <AwardQuestion />,
        showInMenu: false,
        showInMainSection: true
    },
    award_spending_by_recipient: {
        icon: 'building',
        component: <RecipientContainer />,
        headerText: awardSpendingText,
        headerTextTooltip: awardSpedingTooltip,
        showInMenu: true,
        showInMainSection: true,
        title: 'Award Spending by Recipient',
        tooltipDataLeft: {
            title: 'Award Spending by Recipient',
            TooltipContent: RecipientSectionTooltipContentLeft
        },
        tooltipDataRight: {
            title: 'Award Spending',
            TooltipContent: RecipientSectionTooltipContentRight
        }
    },
    award_spending_by_agency: {
        icon: 'sitemap',
        component: <AwardSpendingAgency />,
        headerText: awardSpendingText,
        headerTextTooltip: awardSpedingTooltip,
        showInMenu: true,
        showInMainSection: true,
        title: 'Award Spending by Agency',
        tooltipDataLeft: {
            title: 'Award Spending by Agency',
            TooltipContent: AgencySectionTooltipContentLeft
        },
        tooltipDataRight: {
            title: 'Award Spending',
            TooltipContent: AgencySectionTooltipContentRight
        }
    },
    award_spending_by_assistance_listing: {
        icon: 'plus-circle',
        component: <SpendingByCFDA />,
        headerText: awardSpendingText,
        headerTextTooltip: awardSpedingTooltip,
        showInMenu: true,
        showInMainSection: true,
        title: 'Award Spending by CFDA Program (Assistance Listing)',
        tooltipDataLeft: {
            title: 'Award Spending by CFDA Program (Assistance Listing)',
            TooltipContent: AssistanceListingSectionTooltipContentLeft
        },
        tooltipDataRight: {
            title: 'Award Spending',
            TooltipContent: AssistanceListingSectionTooltipContentRight
        }
    },
    data_sources_and_methodology: {
        showInMenu: true,
        showInMainSection: false,
        title: 'Data Sources and Methodology'
    }
});
