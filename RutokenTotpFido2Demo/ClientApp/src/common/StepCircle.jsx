import React from 'react';

const StepCircle = ({ step }) => {
    if (isNaN(step)) return;

    return (
        <div className="d-flex align-items-center justify-content-center w-2_5rem h-2_5rem rounded-circle border bg-surfie-green">
            <span className='fs-1_5rem text-white'>{step}</span>
        </div>
    );
};

export default StepCircle;
