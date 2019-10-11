/**
 * ChartLoadingMessage.jsx
 * Created by Kevin Li 12/26/17
 */

import React from 'react';
import LoadingBars from 'components/sharedComponents/Loading';

const ChartLoadingMessage = () => (
    <div className="visualization-message-container">
        <div className="visualization-loading">
            <LoadingBars />
            <div className="message">
                Gathering your data...
            </div>
        </div>
    </div>
);

export default ChartLoadingMessage;
