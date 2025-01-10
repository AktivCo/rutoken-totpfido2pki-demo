import React, { useEffect } from "react";
import SuccessIcon2 from "../../images/SuccessIcon2";
import StepCircle from "../../common/StepCircle";
import { useDispatch, useSelector } from "react-redux";
import { NoInstalledPluginError } from "@aktivco-it/rutoken-plugin-bootstrap/src/supportError";
import cn from 'classnames';
import { loadPlugin } from "../../redux/actions/pkiActions";

const PKICheckPlugins = ({ onInstalled }) => {
    const dispatch = useDispatch();
    const { instance: plugin, error } = useSelector(state => state.plugin);

    useEffect(() => {
        let intervalId;

        if (plugin) onInstalled?.();
        else if (error instanceof NoInstalledPluginError) {
            intervalId = setInterval(() => {
                dispatch(loadPlugin());
            }, 1000);
        }        
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [plugin]);

    const isSomethingNotInstalled = error instanceof NoInstalledPluginError;
    const isExtensionNotInstalled = isSomethingNotInstalled && error.needExtension;
    const isPluginNotInstalled = isSomethingNotInstalled && !error.needExtension;
    
    return (
        <div className='d-flex flex-column mb-3 gap-0_75rem '>
            <div className="d-flex flex-column border rounded p-4">
                {
                    isExtensionNotInstalled
                        ? <StepCircle step={1} />
                        : <SuccessIcon2 />
                }
                <h5 className="fw-bold mt-0_75rem mb-0">Адаптер «Рутокен Плагин»</h5>
                <span className="text-secondary mt-0_375rem">Расширение для браузера</span>
                {
                    isExtensionNotInstalled &&
                        <span>Установите <a href="https://chrome.google.com/webstore/detail/адаптер-рутокен-плагин/ohedcglhbbfdgaogjhcclacoccbagkjg" target="_blank" className="text-link mt-0_375rem">расширение</a> или убедитесь, что оно включено</span>
                }
                
            </div>
            <div className={cn('d-flex flex-column border rounded p-4', { 'opacity-50': isExtensionNotInstalled })}>
                {
                    !isExtensionNotInstalled && !isPluginNotInstalled
                        ? <SuccessIcon2 />
                        : <StepCircle step={2} />
                }
                <h5 className="fw-bold mt-0_75rem mb-0">«Рутокен Плагин»</h5>
                <span className="text-secondary mt-0_375rem">Приложение для компьютера</span>
                {
                    isPluginNotInstalled &&
                        <span>Установите <a href="https://download.rutoken.ru/Rutoken_Plugin/Current/Windows/RutokenPlugin.msi" target="_blank" className="text-link mt-0_375rem">приложение</a></span>
                }
            </div>
        </div>
    );
}

export default PKICheckPlugins;