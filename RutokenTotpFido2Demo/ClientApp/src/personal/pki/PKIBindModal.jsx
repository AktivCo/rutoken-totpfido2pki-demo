import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";

import ModalComponent from "../../modal/ModalComponent";
import { hideModal } from '../../redux/actionCreators';
import PKISelectDevice from '../../components/pki/PKISelectDevice';
import PKIEnterPinCode from '../../components/pki/PKIEnterPinCode';
import PKIChangePinCode from '../../components/pki/PKIChangePinCode';
import { bindPki } from '../../redux/actions/pkiActions';
import LoadingContent from '../../common/LoadingContent';
import ErrorContent from '../../common/ErrorContent';
import { Status } from '../../utils/constants';

const PKIBindModal = ({ onSuccess }) => {
    const dispatch = useDispatch();
    const { operationStatus } = useSelector(state => state.plugin);

    const [step, setStep] = useState(2);

    const handleCorrectNotDefaultPinCode = () => {
        setStep(5);
        dispatch(bindPki(onSuccess));
    }

    const getTitle = () => {
        if (step === 2) return 'Выберите Рутокен';
        if (step === 3) return 'Введите PIN‑код';
        if (step === 4) return 'Измените PIN‑код по умолчанию';
    }

    
    const onDeviceSelected = (device) => {
        if(device.isPinCached) {
            handleCorrectNotDefaultPinCode();
            return;
        } 
        setStep(3)
    }

    const renderBody = () => {
        if (step === 2) return <PKISelectDevice onSelect={onDeviceSelected} />;
        if (step === 3) return <PKIEnterPinCode onSuccess={(isDefaultPin) => isDefaultPin ? setStep(4) : handleCorrectNotDefaultPinCode()}/>;
        if (step === 4) return <PKIChangePinCode onSuccess={() => handleCorrectNotDefaultPinCode()} />;

        if (step === 5 && operationStatus === Status.Loading) return <LoadingContent />;
        if (step === 5 && operationStatus === Status.Error) return <ErrorContent />;
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