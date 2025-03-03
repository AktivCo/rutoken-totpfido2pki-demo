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
