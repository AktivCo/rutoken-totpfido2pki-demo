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
    const plugin = useSelector(state => state.plugin);
    const pkiDevices = useSelector(state => state.pkiDevices);

    const [step, setStep] = useState(0);

    useEffect(() => {
        dispatch(loadPlugin());
    }, []);

    useEffect(() => {
        if (plugin.instance)
            setStep(2);
        else if (plugin.status === Status.Error && plugin.error instanceof NoInstalledPluginError)
            setStep(1);
    }, [plugin.status]);

    const getTitle = () => {
        if (plugin.status === Status.Loading) return "";

        if (step === 1) return "Установите компоненты";
        if (step === 2 && pkiDevices.status != Status.Loading) return "Выберите сертификат";
        if (step === 3) return "Введите PIN-код";
        if (step === 4) return "Измените PIN-код по умолчанию";
    }

    const renderBody = () => {
        if (plugin.status === Status.Loading) return <LoadingContent />;
        if (plugin.status === Status.Error && !(plugin.error instanceof NoInstalledPluginError)) return <ErrorContent />;

        if (step === 1) return <PKICheckPlugins onInstalled={() => setStep(2)} />;
        if (step === 2) return <PKISelectCertificate onSelect={() => setStep(3)} />;
        if (step === 3) return <PKIEnterPinCode onSuccess={(isDefaultPin) => isDefaultPin ? setStep(4) : dispatch(loginByCert())}/>;
        if (step === 4) return <PKIChangePinCode onSuccess={() => dispatch(loginByCert())} />;
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
