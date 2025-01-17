import React from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import RutokenLabel from '../images/RutokenLabel';
import cn from 'classnames';
import Step from '../common/Step';
import CommonButton from '../common/CommonButton';
import { Tooltip } from 'react-tooltip';

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
            contentClassName={cn('px-5 py-2rem shadow-lg border-0', className)}
            isOpen={true}
            fade={fade}
            backdrop={backdrop}
            centered
        >
            {
                (title || withLabel) &&
                    <ModalHeader className='d-flex justify-content-center border-0 p-0'>
                        <div className="w-100 d-flex flex-column align-items-center gap-4">
                            {!!withLabel && <RutokenLabel />}
                            <div className='d-flex flex-column gap-0_25rem'>
                                <Step step={step}/>
                                {!!title && <h4 className="text-center m-0">{title}</h4>}
                            </div>
                        </div>
                    </ModalHeader>
            }
            <ModalBody
                className='p-0 d-flex justify-content-center my-4 overflow-y-auto scrollbar-hidden mh-25rem'
                style={{margin: "-0.25rem"}}
            >
                <div className='p-1 w-100'>
                    {children}
                </div>
            </ModalBody>
            {
                (onSubmit || footerLinks) &&
                    <ModalFooter className='d-flex flex-column justify-content-center p-0 w-100 border-0 gap-0_75rem'>
                        {
                            !!onSubmit &&
                                <CommonButton onClick={onSubmit} disabled={submitButtonDisabled} fullWidth>
                                    {submitButtonText}
                                </CommonButton>
                        }
                        {
                            
                            !!withDelimeter &&
                                <div className="text-inside-line m-0 small text-secondary w-100">или</div>
                        }
                        {
                            footerLinks?.map((fl, index) =>
                                <span key={index}
                                    className="modal-footer-link fw-bolder cursor-pointer m-0"
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
            <Tooltip id="cert-name-tooltip" />
        </Modal>
    )
}

export default ModalComponent;