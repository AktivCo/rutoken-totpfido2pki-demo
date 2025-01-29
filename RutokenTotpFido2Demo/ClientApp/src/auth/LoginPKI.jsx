import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import ModalComponent from "../modal/ModalComponent";

import { loadPlugin, loginByCert } from "../redux/actions/pkiActions";
import { loginWithoutTwoFactor } from "../redux/actions";
import PKICheckPlugins from "../components/pki/PKICheckPlugins";
import PKISelectCertificate from "../components/pki/PKISelectCertificate";
import PKIEnterPinCode from "../components/pki/PKIEnterPinCode";
import PKIChangePinCode from "../components/pki/PKIChangePinCode";
import { Status } from "../utils/constants";
import { NoInstalledPluginError } from "@aktivco-it/rutoken-plugin-bootstrap/src/supportError";
import ErrorContent from "../common/ErrorContent";
import LoadingContent from "../common/LoadingContent";

const LoginPKI = () => {
    const dispatch = useDispatch();
    const {
        loadStatus,
        loadError,
        operationStatus,
    } = useSelector(state => state.plugin);

    const [step, setStep] = useState(0);

    useEffect(() => {
        dispatch(loadPlugin())
            .then(() => setStep(2))
            .catch((error) => {
                if (error instanceof NoInstalledPluginError)
                    setStep(1);
            });
    }, []);

    const handleCorrectNotDefaultPinCode = () => {
        setStep(5);
        dispatch(loginByCert());
    }

    const getTitle = () => {
        if ([loadStatus, operationStatus].some(status => status === Status.Loading)) return "";

        if (step === 1) return "Установите компоненты";
        if (step === 2) return "Выберите сертификат";
        if (step === 3) return "Введите PIN-код";
        if (step === 4) return "Измените PIN-код по умолчанию";
    }

    const onDeviceSelected = (device) => {
        if(device.isPinCached) {
            handleCorrectNotDefaultPinCode();
            return;
        } 
        setStep(3);
    }

    const renderBody = () => {
        if (loadStatus === Status.Loading) return <LoadingContent />;
        if (loadStatus === Status.Error && !(loadError instanceof NoInstalledPluginError)) return <ErrorContent />;

        if (step === 1) return <PKICheckPlugins onInstalled={() => setStep(2)} />;
        if (step === 2) return <PKISelectCertificate onSelect={onDeviceSelected} />;
        if (step === 3) return <PKIEnterPinCode onSuccess={(isDefaultPin) => isDefaultPin ? setStep(4) : handleCorrectNotDefaultPinCode()}/>;
        if (step === 4) return <PKIChangePinCode onSuccess={handleCorrectNotDefaultPinCode} />;
        
        if (step === 5 && operationStatus === Status.Loading) return <LoadingContent />;
        if (step === 5 && operationStatus === Status.Error) return <ErrorContent />;
    }

    return (
        <ModalComponent
            title={getTitle()}
            withLabel
            footerLinks={[{ onClick: () => dispatch(loginWithoutTwoFactor(null)), label: 'Назад' }]}
            backdrop={false}
            fade={false}
        >
            {renderBody()}
        </ModalComponent>
    )
}

export default LoginPKI;
