import React from 'react';
import cn from 'classnames';
import CommonButton from '../common/CommonButton';
import Step from '../common/Step';

const StepContainer = ({currentStep, stepId, header, toNextStep, btnTitle, children}) => {

    const renderClass = () => cn({
        "personal-add-device-header": true,
        "opacity-50": stepId > currentStep
    });

    return (
        <div className="mt-4">
            <Step step={stepId} />
            <div className={renderClass()}>{header}</div>
            {
                currentStep >= stepId &&
                <>
                    {children}
                    {toNextStep && (
                        <StepButton
                            currentStep={currentStep}
                            stepId={stepId}
                            toNextStep={toNextStep}
                            btnTitle={btnTitle}
                        />
                    )}

                </>
            }
        </div>
    );
}

const StepButton = ({currentStep, stepId, toNextStep, btnTitle}) => {
    if (currentStep !== stepId) return null;
    const onClick = () => {
        return toNextStep(stepId + 1);
    }
    return (
        <div className="col-sm-5 mt-4">
            <CommonButton onClick={onClick}>
                {btnTitle ?? "Продолжить"}
            </CommonButton>
        </div>
    );
}


export default StepContainer;