import React, { useEffect } from "react";
import CommonButton from "../../common/CommonButton";
import Step from "../../common/Step";
import { useDispatch } from "react-redux";
import PKIBindModal from "./PKIBindModal";
import PKICheckPlugins from "../../components/pki/PKICheckPlugins";
import { showModal } from "../../redux/actionCreators";
import { loadPlugin } from "../../redux/actions/pkiActions";

const PKIBindInit = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadPlugin())
    }, []);

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
            <CommonButton className={'mt-0_5rem'} onClick={() => dispatch(showModal(PKIBindModal))}>
                Добавить Рутокен
            </CommonButton>
        </>
    );
}

export default PKIBindInit;
