import React from "react";

const FidoLoadingContent = () => {
    return (
        <div className="d-flex flex-column align-items-center mt-5_625rem">
            <div className='spinner'></div>
            <small className='d-flex flex-column align-items-center text-secondary mt-0_75rem mb-4_125rem'>
                <div>Не отключайте токен</div>
                <div>до завершения процесса</div>
            </small>
        </div>
    );
}

export default FidoLoadingContent;