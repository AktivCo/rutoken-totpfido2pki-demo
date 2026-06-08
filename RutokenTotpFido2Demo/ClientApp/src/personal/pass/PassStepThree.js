import React from "react";
import { useDispatch } from "react-redux";

import StepContainer from "../StepContainer";
import RegisterFidoModal from "../fido/RegisterFidoModal";
import CommonButton from "../../common/CommonButton";

import { showModal } from "../../redux/actionCreators";
import { ExternalLinks } from "../../utils/constants";
import { Factor } from "../../utils/constants";


const PassStepThree = ({currentStep}) => {
    const stepId = 3;
    const dispatch = useDispatch();

    const registerPass = () => {
        dispatch(showModal(RegisterFidoModal, {
            isWithoutLogin: true,
            factor: Factor.PASS,
        }));
    };

    return (
        <StepContainer
            stepId={stepId}
            header={"Создайте учетную запись на Рутокен"}
            currentStep={currentStep}
        >
            <div className="d-flex flex-column gap-0_5rem">
                <div>
                    Нажмите «Продолжить» и следуйте шагам согласно{' '}
                    <a href={ExternalLinks.RutokenUserGuide} target="_blank" rel="noreferrer" className="link-text-default">
                        инструкции
                    </a>
                </div>

                <div className="text-gray-light">
                    Процесс создания учетной записи на Рутокен отличается в зависимости от ОС устройства и браузера
                </div>
            </div>

            <CommonButton onClick={registerPass} className="mt-4">
                Продолжить
            </CommonButton>
        </StepContainer>
    );
};

export default PassStepThree;