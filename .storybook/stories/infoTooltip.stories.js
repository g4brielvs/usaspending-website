import React from 'react';
import InfoTooltip from '../components/infoTooltip';

export default { title: 'Tooltip' };

export const defaultTooltip = () => (
  <InfoTooltip>
    <p>This is some tooltipContent</p>
  </InfoTooltip>
);
