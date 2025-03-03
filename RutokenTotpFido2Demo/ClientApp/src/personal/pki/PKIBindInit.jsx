import React, { useEffect } from "react";
import CommonButton from "../../common/CommonButton";
import Step from "../../common/Step";
import { useDispatch, useSelector } from "react-redux";
import PKIBindModal from "./PKIBindModal";
import PKICheckPlugins from "../../components/pki/PKICheckPlugins";
import { hideModal, showModal } from "../../redux/actionCreators";
import { loadPlugin } from "../../redux/actions/pkiActions";
import { NoInstalledPluginError } from "@aktivco-it/rutoken-plugin-bootstrap/src/supportError";
import { Status } from "../../utils/constants";

const PKIBindInit = () => {
    const dispatch = useDispatch();
    const { loadStatus, loadError } = useSelector(state => state.plugin);

    useEffect(() => {
        dispatch(loadPlugin(false));
    }, []);

    const buttonIsDisabled = loadStatus === Status.Error && loadError instanceof NoInstalledPluginError;

    const renderSafariError = () => (
        <>
            <div className='d-flex flex-column mt-3'>
                <Step step={1} />
                <div className='personal-add-device-header'>Адаптер «Рутокен Плагин»</div>
            </div>
            <div className='d-flex flex-column gap-3 mt-0_375rem mb-4'>
                <div className='brief-mfa'>
                    <div>Расширение недоступно в браузере Safari</div>
                </div>
            </div>
            <div className="personal-safari-error px-1_5rem py-1_5rem">
                <div className="mb-0_375rem text-arsenic opacity-0_7">Выберите другой браузер:</div>
                
                <div>
                    <a className="link-text" href="https://www.opera.com/ru" target="_blank">Opera</a>,&nbsp;
                    <a className="link-text" href="https://www.mozilla.org/ru/firefox/new" target="_blank">Firefox</a>,&nbsp;
                    <a className="link-text" href="https://www.google.com/intl/ru_ru/chrome" target="_blank">Chrome</a>,&nbsp;
                    <a className="link-text" href="https://www.chromium.org/getting-involved/download-chromium" target="_blank">Chromium</a>,
                    или&nbsp;
                    <a className="link-text" href="https://browser.yandex.ru" target="_blank">Yandex Browser</a>
                </div>
            </div>
        </>
    );
    
    if (loadError?.browser?.name == "Safari")
        return renderSafariError();

    return (
        <>
            <div className='d-flex flex-column mt-3'>
                <Step step={1} />
                <div className='personal-add-device-header'>Установите компоненты</div>
            </div>
            <div className='d-flex flex-column gap-3 mt-0_375rem mb-4'>
                <div className='brief-mfa'>
                    <div>Они необходимы для получения доступа к хранилищу</div>
                    <div>устройства Рутокен и работы с сертификатами и ключами.</div>
                </div>
            </div>
            <PKICheckPlugins />

            <div className="d-flex gap-3 mt-0_5rem">
                <CommonButton
                    className="text-nowrap"
                    onClick={() => dispatch(showModal(PKIBindModal, { onSuccess: () => dispatch(hideModal()) }))}
                    disabled={buttonIsDisabled}
                >
                    Добавить Рутокен
                </CommonButton>
                {
                    buttonIsDisabled &&
                    <span className="text-arsenic opacity-0_7 fs-1rem ml-2 my-auto">
                        Для проверки наличия установленных компонентов, перезагрузите страницу
                    </span>
                }
            </div>

        </>
    );
}

export default PKIBindInit;
