import React, { useState }  from "react";
import { useSelector } from "react-redux";
import PassStepOne from "./PassStepOne";
import PassStepTwo from "./PassStepTwo";
import PassStepThree from "./PassStepThree";

const InitPass = ({setVisible}) => {
    const passKeys = useSelector(state => state.userInfo.passKeys);

    const [step, setStep] = useState(1);
    const toNextStep = (toStep) => {
        setStep(toStep);
    }

    const close = () => {
        setVisible(false);
    }

    return (
        <>
            {
                passKeys.length > 0 &&
                <div className='d-flex align-items-center justify-content-between gap-0_25rem'>
                    <div className='personal-add-device-header'>Добавить второй фактор защиты</div>
                    <div className='personal-logout personal-logout__text'
                            onClick={() => close()}
                    >
                        Отменить
                    </div>
                </div>
            }
            <PassStepOne currentStep={step} toNextStep={toNextStep}/>
            <PassStepTwo currentStep={step} toNextStep={toNextStep}/>
            <PassStepThree currentStep={step} toNextStep={toNextStep}/>
        </>
    );
};

export default InitPass;
