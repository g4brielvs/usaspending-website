import React from 'react';
import InfoTooltip from '../components/infoTooltip';

export default { title: 'Tooltip' };

export const defaultTooltip = () => (
  <div className="tooltip-story__container">
    <InfoTooltip>
      <div>
        <div className="info-tooltip__title">The title of the Tooltip</div>
        <div className="info-tooltip__text">
          <p>Here is some tooltip content that is super neat and informative</p>
        </div>
      </div>
    </InfoTooltip>
  </div>
);
