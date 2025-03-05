import React from "react";
import ErrorIcon from "../images/ErrorIcon";

const RedErrorContent = ({ text }) => {
    return (
        <div className="mt-4_375rem w-100">
            <div className='d-flex flex-column align-items-center mb-2_875rem text-center'>
                <ErrorIcon />
                    <small style={{ maxWidth: "260px" }} className='text-secondary mt-0_75rem'>{text}</small>
            </div>
        </div>
    );
}

export default RedErrorContent;