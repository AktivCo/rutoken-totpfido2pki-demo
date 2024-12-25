import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import ModalComponent from "../modal/ModalComponent";
import { loadPlugin, loginWithoutTwoFactor } from "../redux/actions";
import RutokenCheckPluginsContent from "../components/rutoken/RutokenCheckPluginsContent";
import SelectCertificateRutoken from "../personal/rutoken/SelectCertificateRutoken";
import ErrorContent from "../common/ErrorContent";
import { NoInstalledPluginError } from "@aktivco-it/rutoken-plugin-bootstrap/src/supportError";

import EnterPinCodeModal from "../components/rutoken/EnterPinCodeModal";

const LoginRutoken = () => {
    const dispatch = useDispatch();

    const plugin = useSelector(state => state.plugin);
    const rutokenInfo = useSelector(state => state.rutokenInfo);

    useEffect(() => {
        dispatch(loadPlugin());
    }, []);

    useEffect(() => {
        let intervalId;

        if (plugin.loadError instanceof NoInstalledPluginError) {
            intervalId = setInterval(() => {
                dispatch(loadPlugin());
            }, 1000);
        }        
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [plugin]);

    const getTitle = () => {
        if (plugin.loadError instanceof NoInstalledPluginError) return "Установите компоненты";
        return "Выберите сертификат";
    }

    const renderBody = () => {
        if (plugin.loadError instanceof NoInstalledPluginError) return <RutokenCheckPluginsContent />;
        if (plugin.instance) return <SelectCertificateRutoken/>
        return <ErrorContent />
    }

    return (
        <>
            {
                !rutokenInfo &&
                <ModalComponent
                    title={getTitle()}
                    withLabel
                    footerLinks={[{ onClick: () => dispatch(loginWithoutTwoFactor(null)), label: 'Назад' }]}
                    backdrop={false}
                    fade={false}
                >
                    {renderBody()}
                </ModalComponent>
            }
            {
                rutokenInfo &&
                <EnterPinCodeModal />
            }
        </>
    )
}

export default LoginRutoken;
