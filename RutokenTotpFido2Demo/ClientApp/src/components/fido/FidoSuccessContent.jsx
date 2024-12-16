import React from "react";
import SuccessIcon from "../../images/SuccessIcon";

const FidoSuccessContent = () => {
    return (
        <div className='d-flex flex-column align-items-center mt-0_75rem mb-4_125rem mt-4_375rem'>
            <SuccessIcon />
            <h5 className='fw-bold mt-2'>Успешно!</h5>
        </div>
    );
}

export default FidoSuccessContent;