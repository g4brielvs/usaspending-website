/**
 * BudgetCategories.jsx
 * Created by James Lee 6/5/20
 */

import React, { useState, useEffect } from 'react';
import BudgetCategoriesCountTabContainer from 'containers/covid19/budgetCategories/BudgetCategoriesCountTabContainer';
import BudgetCategoriesTableContainer from 'containers/covid19/budgetCategories/BudgetCategoriesTableContainer';

const tabs = [
    {
        type: 'federal_accounts',
        label: 'Federal Accounts',
        description: 'What accounts funded this response?',
        subHeading: 'Treasury Accounts',
        countField: 'federal_account_count',
        subCountField: 'treasury_account_count'
    },
    {
        type: 'def_codes',
        label: 'Public Laws',
        description: 'What legislative acts funded this spending?',
        countField: 'def_codes_count'
    },
    {
        type: 'agencies',
        label: 'Agencies',
        description: 'What agencies did the spending?',
        countField: 'agencies_count'
    },
    {
        type: 'object_classes',
        label: 'Object Classes',
        description: 'What items or services were purchased',
        countField: 'object_class_count'
    }
];

const BudgetCategories = () => {
    const [activeTab, setActiveTab] = useState('federal_accounts');
    const [defCodes, setDefCodes] = useState([]);
    const subHeading = tabs.find((tab) => tab.type === activeTab).subHeading;

    useEffect(() => {
        // Uncomment below when API is done
        // const requestDefCodes = fetchDefCodes();
        // requestDefCodes.promise.then((res) => {
        //     setDefCodes(res.data.codes.filter((code) => code.disaster === 'covid_19'));
        // });

        setDefCodes(
            [
                {
                    code: "Q",
                    title: null,
                    urls: null,
                    disaster: null
                },
                {
                    code: "R",
                    title: "Future Disaster and P.L. To Be Determined",
                    urls: null,
                    disaster: null
                },
                {
                    code: "S",
                    title: "Future Disaster and P.L. To Be Determined",
                    urls: null,
                    disaster: null
                },
                {
                    code: "T",
                    title: "Future Disaster and P.L. To Be Determined",
                    urls: null,
                    disaster: null
                },
                {
                    code: "9",
                    title: "DEFC of '9' Indicates that the data for this row is not related to a COVID-19 P.L. (not DEFC = L, M, N, O, or P), but that the agency has declined to specify which other DEFC (or combination of DEFCs, in the case that the money hasn't been split out like it would be with a specific DEFC value) applies.",
                    urls: null,
                    disaster: null
                },
                {
                    code: "A",
                    title: "Supplemental Appropriations for Disaster Relief Requirements Act, 2017",
                    urls: [
                        "https://www.congress.gov/115/plaws/publ56/PLAW-115publ56.htm"
                    ],
                    disaster: null
                },
                {
                    code: "B",
                    title: "Additional Supplemental Appropriations for Disaster Relief Requirements Act, 2017",
                    urls: [
                        "https://www.congress.gov/115/plaws/publ72/PLAW-115publ72.htm"
                    ],
                    disaster: null
                },
                {
                    code: "C",
                    title: "Bipartisan Budget Act of 2018",
                    urls: [
                        "https://www.congress.gov/115/plaws/publ123/PLAW-115publ123.htm"
                    ],
                    disaster: null
                },
                {
                    code: "D",
                    title: "FAA Reauthorization Act of 2018",
                    urls: [
                        "https://www.congress.gov/115/plaws/publ254/PLAW-115publ254.htm"
                    ],
                    disaster: null
                },
                {
                    code: "E",
                    title: "Additional Supplemental Appropriations for Disaster Relief Act, 2019.",
                    urls: [
                        "https://www.congress.gov/116/plaws/publ20/PLAW-116publ20.pdf"
                    ],
                    disaster: null
                },
                {
                    code: "F",
                    title: "EMERGENCY SUPPLEMENTAL APPROPRIATIONS FOR HUMANITARIAN ASSISTANCE AND SECURITY AT THE SOUTHERN BORDER ACT, 2019",
                    urls: [
                        "https://www.congress.gov/116/plaws/publ26/PLAW-116publ26.htm"
                    ],
                    disaster: null
                },
                {
                    code: "G",
                    title: "Consolidated Appropriations Act, 2020",
                    urls: [
                        "https://www.congress.gov/116/plaws/publ93/PLAW-116publ93.htm"
                    ],
                    disaster: null
                },
                {
                    code: "H",
                    title: "Consolidated Appropriations Act, 2020",
                    urls: [
                        "https://www.congress.gov/116/plaws/publ93/PLAW-116publ93.htm"
                    ],
                    disaster: null
                },
                {
                    code: "I",
                    title: "Further Consolidated Appropriations Act, 2020",
                    urls: [
                        "https://www.congress.gov/bill/116th-congress/house-bill/1865/tex"
                    ],
                    disaster: null
                },
                {
                    code: "J",
                    title: "Further Consolidated Appropriations Act, 2020",
                    urls: [
                        "https://www.congress.gov/bill/116th-congress/house-bill/1865/text"
                    ],
                    disaster: null
                },
                {
                    code: "K",
                    title: "United States-Mexico-Canada Agreement Implementation Act",
                    urls: [
                        "https://www.congress.gov/bill/116th-congress/house-bill/5430/text"
                    ],
                    disaster: null
                },
                {
                    code: "L",
                    title: "Coronavirus Preparedness and Response Supplemental Appropriations Act, 2020",
                    urls: [
                        "https://www.congress.gov/116/plaws/publ123/PLAW-116publ123.pdf"
                    ],
                    disaster: "covid_19"
                },
                {
                    code: "M",
                    title: "Families First Coronavirus Response Act",
                    urls: [
                        "https://www.congress.gov/116/plaws/publ127/PLAW-116publ127.pdf"
                    ],
                    disaster: "covid_19"
                },
                {
                    code: "N",
                    title: "Coronavirus Aid, Relief, and Economic Security Act or the CARES Act",
                    urls: [
                        "https://www.congress.gov/116/bills/hr748/BILLS-116hr748enr.pdf"
                    ],
                    disaster: "covid_19"
                },
                {
                    code: "O",
                    title: "Coronavirus Aid, Relief, and Economic Security Act or the CARES Act",
                    urls: [
                        "https://www.congress.gov/116/bills/hr748/BILLS-116hr748enr.pdf",
                        "https://www.congress.gov/116/plaws/publ139/PLAW-116publ139.pdf"
                    ],
                    disaster: "covid_19"
                },
                {
                    code: "P",
                    title: "Paycheck Protection Program and Health Care Enhancement Act)",
                    urls: [
                        "https://www.congress.gov/116/plaws/publ139/PLAW-116publ139.pdf"
                    ],
                    disaster: "covid_19"
                }
            ]
        );
    }, []);

    return (
        <div className="body__content">
            <div className="count-tabs">
                <div className="count-tabs__questions">
                    {tabs.map((tab) => (
                        <div key={tab.type}>
                            {tab.description}
                        </div>
                    ))}
                </div>
                <div className="count-tabs__buttons">
                    {tabs.map((tab) => (
                        <BudgetCategoriesCountTabContainer
                            key={tab.type}
                            {...tab}
                            setActiveTab={setActiveTab}
                            active={activeTab === tab.type}
                            fy={2020}
                            defCodes={defCodes} />
                    ))}
                </div>
                <BudgetCategoriesTableContainer
                    type={activeTab}
                    subHeading={subHeading}
                    fy={2020}
                    defCodes={defCodes} />
            </div>
        </div>
    );
};

export default BudgetCategories;