import React from 'react';

const Step = ({ step }) => {
    if (isNaN(step)) return;

    return (
        <span className='lh-1_25rem fs-0_875rem fw-600 text-arsenic opacity-0_3'>ШАГ {step}</span>
    );
};

export default Step;
