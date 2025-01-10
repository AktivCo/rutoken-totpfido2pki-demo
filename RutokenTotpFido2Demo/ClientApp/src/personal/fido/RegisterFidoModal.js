import React, {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";

import ModalComponent from "../../modal/ModalComponent";
import EditDeviceNameModal from "./EditDeviceNameModal";
import {registerFido} from "../../redux/actions";
import { Status } from '../../utils/constants';
import ErrorContent from "../../common/ErrorContent";
import FidoSuccessContent from "../../components/fido/FidoSuccessContent";
import LoadingContent from "../../common/LoadingContent";
import { hideModal, showModal } from '../../redux/actionCreators';

const RegisterFidoModal = ({isWithoutLogin}) => {
    const dispatch = useDispatch();

    const [status, setStatus] = useState(null);

    useEffect(() => register(), []);

    const register = () => {
        setStatus(Status.Loading);
        dispatch(registerFido(isWithoutLogin))
            .then((response) => {
                setStatus(Status.Success);
                setTimeout(() => {
                    dispatch(showModal(EditDeviceNameModal, {isCreate: true, credential: response, isWithoutLogin: isWithoutLogin}))
                }, 1000);
            })
            .catch(err => {
                setStatus(Status.Error);
            });
    }

    const close = () => {
        dispatch(hideModal());
    }

    const renderBody = () => {
        if (status === Status.Error) return <ErrorContent />;
        if (status === Status.Loading) return <LoadingContent />;
        if (status === Status.Success) return <FidoSuccessContent />;
    }

    return (
        <ModalComponent
            className={'custom-modal'}
            title={'Добавление токена'}
            step={2}
            {...(status === Status.Error && {onSubmit: register, submitButtonText: 'Повторить'})}
            {...(status === Status.Error && {footerLinks: [{onClick: close, label: 'Закрыть'}]})}
        >
            {renderBody()}
        </ModalComponent>
    )
}

export default RegisterFidoModal;