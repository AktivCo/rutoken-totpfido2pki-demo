import React, {forwardRef} from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import RutokenLabel from '../images/RutokenLabel';
import cn from 'classnames';
import Step from '../common/Step';
import CommonButton from '../common/CommonButton';
import { Tooltip } from 'react-tooltip';
import useIsMobile from '../utils/hooks/useIsMobile';

const ModalComponent = forwardRef(({
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
    isAnimateLabel,
}, ref) => {
    const isMobile = useIsMobile();
    const effectiveWithLabel = withLabel || isMobile;

    return (
        <Modal
            contentClassName={cn('px-5 py-2rem shadow-lg border-0', className)}
            isOpen={true}
            fade={fade}
            backdrop={backdrop}
            centered
        >
            {
                (title || effectiveWithLabel) &&
                    <ModalHeader className='d-flex justify-content-center border-0 p-0'>
                        <div className="w-100 d-flex flex-column align-items-center gap-4">
                            {!!effectiveWithLabel && <RutokenLabel />}
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
                                <CommonButton onClick={onSubmit} disabled={submitButtonDisabled} fullWidth ref={ref}>
                                    {submitButtonText}
                                </CommonButton>
                        }
                        {
                            
                            !!withDelimeter &&
                                <div className="text-inside-line m-0 small text-secondary w-100">или</div>
                        }
                        {
                            footerLinks?.map((fl, index) =>
                                <div key={index}
                                    className={cn(
                                        "d-flex flex-column justify-content-center align-items-center",
                                        "fw-bolder cursor-pointer m-0",
                                        isAnimateLabel ? "modal-footer-link" : "modal-footer-link-default"
                                    )}
                                    onClick={fl.onClick}
                                >
                                    {
                                        fl.label && fl.label
                                    }
                                    {
                                        fl.labels && fl.labels.map((x) => <span key={x} className="line">{x}</span>)
                                    }
                                </div>
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
});

export default ModalComponent;