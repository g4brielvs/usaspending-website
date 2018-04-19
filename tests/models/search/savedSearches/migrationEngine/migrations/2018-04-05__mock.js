export const mockData = {
    filters: {
        keyword: "Keyword",
        timePeriodType: "fy",
        timePeriodFY: [
            "2018"
        ],
        timePeriodStart: null,
        timePeriodEnd: null,
        selectedLocations: {
            USA_AZ_009: {
                identifier: "USA_XX_000",
                display: {
                    title: "Fake County",
                    entity: "County",
                    standalone: "Fake County, XX"
                },
                filter: {
                    country: "USA",
                    state: "XX",
                    county: "000"
                }
            }
        },
        locationDomesticForeign: "all",
        selectedFundingAgencies: {
            '1_toptier': {
                id: 1,
                toptier_flag: true,
                toptier_agency: {
                    cgac_code: "000",
                    fpds_code: "0000",
                    abbreviation: "DOP",
                    name: "Department of Pizza"
                },
                subtier_agency: {
                    subtier_code: "1000",
                    abbreviation: "DOP",
                    name: "Department of Pizza"
                },
                office_agency: null,
                agencyType: "toptier"
            }
        },
        selectedAwardingAgencies: {
            '2_subtier': {
                id: 2,
                toptier_flag: false,
                toptier_agency: {
                    cgac_code: "2222",
                    fpds_code: "2222",
                    abbreviation: "XXX",
                    name: "Department of X"
                },
                subtier_agency: {
                    subtier_code: "2223",
                    abbreviation: "XXA",
                    name: "Office of A"
                },
                office_agency: null,
                agencyType: "subtier"
            }
        },
        selectedRecipients: [
            "MoneyProfitBusinessCorpIncLLC GmbH"
        ],
        recipientDomesticForeign: "all",
        recipientType: [
            "woman_owned_business"
        ],
        selectedRecipientLocations: {
            CNM: {
                identifier: "CNM",
                display: {
                    title: "Country Name",
                    entity: "Country",
                    standalone: "COUNTRY NAME"
                },
                filter: {
                    country: "CNM"
                }
            }
        },
        awardType: [
            "A",
            "B",
            "C",
            "D"
        ],
        selectedAwardIDs: {
            12345: "12345"
        },
        awardAmounts: {
            specific: [
                0,
                0
            ]
        },
        selectedCFDA: {
            '1111': {
                program_number: "11.111",
                program_title: "Example CFDA",
                popular_name: "",
                identifier: "1111"
            }
        },
        selectedNAICS: {
            '2222': {
                naics_description: "Example NAICS",
                naics: "2222",
                identifier: "2222"
            }
        },
        selectedPSC: {
            X123: {
                product_or_service_code: "X123",
                psc_description: "Example psc",
                identifier: "X123"
            }
        },
        pricingType: [
            "R",
            "U"
        ],
        setAside: [
            "BICiv",
            "HS3"
        ],
        extentCompeted: [
            "E Civ",
            "A"
        ]
    },
    version: "2017-11-21"
}