import React from "react";
import InformationIcon from "../../images/InformationIcon";
import { Button } from "reactstrap";

const FidoErrorContent = ({onRetry, onBack, backText='Назад'}) => {
    return (
        <div className="mt-4_375rem w-100">
            <div className='d-flex flex-column align-items-center'>
                <InformationIcon />
                <div className='mt-0_75rem text-secondary'>
                    <small>
                        <div>Произошла ошибка,</div>
                        <div>попробуйте еще раз</div>
                    </small>
                </div>
            </div>
            <Button type="submit" color="danger" className="mt-4_375rem mb-0" onClick={onRetry}>
                Повторить
            </Button>
            <div className="text-center mt-3">
                <span
                    className="modal-footer-link fw-bolder cursor-pointer"
                    onClick={onBack}
                >
                    {backText}
                </span>
            </div>
        </div>
    );
}

export default FidoErrorContent;