import React from "react";
import InformationIcon from "../images/InformationIcon";
import { Button } from "reactstrap";

const ErrorContent = ({ onRetry }) => {
    return (
        <div className="mt-4_375rem w-100">
            <div className='d-flex flex-column align-items-center mb-4_375rem'>
                <InformationIcon />
                <div className='mt-0_75rem text-secondary'>
                    <small>
                        <div>Произошла ошибка,</div>
                        <div>попробуйте еще раз</div>
                    </small>
                </div>
            </div>
            {
                onRetry &&
                    <Button type="submit" color="danger" className="mb-0" onClick={onRetry}>
                        Повторить
                    </Button>
            }
        </div>
    );
}

export default ErrorContent;