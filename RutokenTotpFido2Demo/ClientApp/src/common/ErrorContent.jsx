import React from "react";
import InformationIcon from "../images/InformationIcon";

const ErrorContent = () => {
    return (
        <div className="mt-4_375rem w-100">
            <div className='d-flex flex-column align-items-center mb-2_875rem'>
                <InformationIcon />
                <div className='mt-0_75rem text-secondary'>
                    <small>
                        <div>Произошла ошибка,</div>
                        <div>попробуйте еще раз</div>
                    </small>
                </div>
            </div>
        </div>
    );
}

export default ErrorContent;