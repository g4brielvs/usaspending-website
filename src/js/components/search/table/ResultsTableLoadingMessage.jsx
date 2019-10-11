/**
  * ResultsTableLoadingMessage.jsx
  * Created by Kevin Li 12/21/17
  **/

import React from 'react';

import LoadingBars from 'components/sharedComponents/Loading';

const ResultsTableLoadingMessage = () => (
    <div className="results-table-loading">
        <LoadingBars />
        <div className="loading-message">
            Gathering your data...
        </div>
    </div>
);

export default ResultsTableLoadingMessage;
