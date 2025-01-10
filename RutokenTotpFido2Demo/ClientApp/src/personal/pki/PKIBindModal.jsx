import React, { useState } from 'react';
import { useDispatch } from "react-redux";

import ModalComponent from "../../modal/ModalComponent";
import { hideModal } from '../../redux/actionCreators';
import PKISelectDevice from '../../components/pki/PKISelectDevice';
import PKIEnterPinCode from '../../components/pki/PKIEnterPinCode';
import PKIChangePinCode from '../../components/pki/PKIChangePinCode';

const PKIBindModal = () => {
    const dispatch = useDispatch();

    const [step, setStep] = useState(2);

    const getTitle = () => {
        if (step === 2) return 'Выберите Рутокен';
        if (step === 3) return 'Введите PIN‑код';
        if (step === 4) return 'Измените PIN‑код по умолчанию';
    }

    const renderBody = () => {
        if (step === 2) return <PKISelectDevice onSelect={() => setStep(3)} />;
        if (step === 3) return <PKIEnterPinCode onSuccess={(isDefaultPin) => isDefaultPin ? setStep(4) : generateCertRequest()}/>;
        if (step === 4) return <PKIChangePinCode onSuccess={() => generateCertRequest()} />;
        if (step === -1) return 'In develop...' //TOOD Delete
    }

    const generateCertRequest = () => {
        //TODO
        setStep(-1);
    }

    return (
        <ModalComponent
            title={getTitle()}
            step={step}
            footerLinks={[{ onClick: () => dispatch(hideModal()), label: 'Назад' }]}
        >
            {renderBody()}
        </ModalComponent>
    )
}

export default PKIBindModal;