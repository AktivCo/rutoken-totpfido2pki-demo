import React from 'react';
import ErrorIcon from '../../../images/ErrorIcon'


const BlockPinContent = () => {
    return (
        <div className='mt-4_375rem w-100'>
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

export default BlockPinContent;