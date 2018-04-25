/**
 * BadgeParent.jsx
 * Created by Kevin Li 4/25/18
 */

import React from 'react';
import { InfoCircle } from 'components/sharedComponents/icons/Icons';

const BadgeParent = () => (
    <div className="parent-badge">
        <div className="parent-badge__label">
            Parent Recipient
        </div>
        <button
            className="parent-badge__info">
            <InfoCircle alt="More information" />
        </button>
    </div>
);

export default BadgeParent;
