import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import ModalComponent from "../modal/ModalComponent";
import { loadPlugin, loginWithoutTwoFactor } from "../actions";
import RutokenCheckPluginsContent from "../components/rutoken/RutokenCheckPluginsContent";
import ErrorContent from "../common/ErrorContent";
import { NoInstalledPluginError } from "@aktivco-it/rutoken-plugin-bootstrap/src/supportError";

const LoginRutoken = () => {
    const dispatch = useDispatch();

    const plugin = useSelector(state => state.plugin);

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
    }

    const renderBody = () => {
        if (plugin.loadError instanceof NoInstalledPluginError) return <RutokenCheckPluginsContent />;
        return <ErrorContent />
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

export default LoginRutoken;
