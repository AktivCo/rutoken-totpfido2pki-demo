import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import RutokenLabel from '../images/RutokenLabel';

const ModalComponent = ({
    title,
    children,
    backdrop,
    className,
    withLabel,
    step,
    onSubmit,
    submitButtonText = "Продолжить",
    submitButtonDisabled,
    withDelimeter,
    footerLinks,
    footerError,
    fade,
}) => {
    return (
        <Modal
            contentClassName={'px-5 py-2rem shadow-lg border-0' + (className ? ` ${className}` : '')}
            isOpen={true}
            fade={fade}
            backdrop={backdrop}
            centered
        >
            {
                (title || withLabel) &&
                    <ModalHeader className='d-flex justify-content-center border-0 p-0'>
                        <div className="w-100 d-flex flex-column align-items-center">
                            {!!withLabel && <RutokenLabel className="mb-4" />}
                            {!isNaN(step) && <span className='text-secondary opacity-50 fs-0_875rem'>ШАГ {step}</span>}
                            {!!title && <h4 className="text-center m-0">{title}</h4>}
                        </div>
                    </ModalHeader>
            }
            <ModalBody className='p-0 d-flex justify-content-center'>
                {children}
            </ModalBody>
            {
                (onSubmit || footerLinks) &&
                    <ModalFooter className='d-flex flex-column justify-content-center p-0 w-100 border-0'>
                        {
                            !!onSubmit &&
                                <Button
                                    type='submit'
                                    color="danger"
                                    className='m-0 fs-1_125rem'
                                    onClick={onSubmit}
                                    disabled={submitButtonDisabled}
                                >
                                    {submitButtonText}
                                </Button>
                        }
                        {
                            
                            !!withDelimeter &&
                                <div className="text-inside-line m-0 mt-0_75rem small text-secondary w-100">или</div>
                        }
                        {
                            footerLinks?.map((fl, index) =>
                                <span key={index}
                                    className="modal-footer-link fw-bolder cursor-pointer m-0 mt-3"
                                    onClick={fl.onClick}
                                >
                                    {fl.label}
                                </span>
                            )
                        }
                        {
                            !!footerError &&
                                <small className="d-block text-center text-danger m-0">{footerError}</small>
                        }
                    </ModalFooter>
            }
        </Modal>
    )
}

export default ModalComponent;