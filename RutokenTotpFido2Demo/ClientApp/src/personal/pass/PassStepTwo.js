import React from "react";
import StepContainer from "../StepContainer";


const PassStepTwo = ({currentStep, toNextStep}) => {
    const stepId = 2;
    return (
        <StepContainer
            stepId={stepId}
            header={"Подключите Рутокен"}
            currentStep={currentStep}
            toNextStep={toNextStep}
        >
            <div>
                Модели Рутокен с NFC можно подключить с помощью контактного (iOS/iPadOS, macOS, Android)
                или бесконтактного (macOS с внешним считывателем, Android) интерфейса
            </div>
            <div className="d-flex gap-0_5rem mt-4">
                <div className="pass_img_1"></div>
                <div className="pass_img_2"></div>
            </div>
        </StepContainer>
    );
};

export default PassStepTwo;