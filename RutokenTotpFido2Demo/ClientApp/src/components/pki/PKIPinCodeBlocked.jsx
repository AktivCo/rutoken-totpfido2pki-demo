import React from 'react';
import ErrorIcon from '../../images/ErrorIcon';

const PKIPinCodeBlocked = () => {
    return (
        <div className='my-3_5rem w-100'>
            <div className='d-flex flex-column align-items-center mb-4_375rem'>
                <ErrorIcon />
                <div className='mt-0_75rem text-secondary'>
                    <small>
                        <div>PIN-код заблокирован</div>
                    </small>
                </div>
            </div>
        </div>
    );
}

export default PKIPinCodeBlocked;