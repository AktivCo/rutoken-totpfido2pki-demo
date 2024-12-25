import React, {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";

import ModalComponent from "../../modal/ModalComponent";
import EditDeviceNameModal from "./EditDeviceNameModal";
import {registerFido, showModal, hideModal} from "../../redux/actions";
import { State } from '../../utils/constants';
import ErrorContent from "../../common/ErrorContent";
import FidoSuccessContent from "../../components/fido/FidoSuccessContent";
import FidoLoadingContent from "../../components/fido/FidoLoadingContent";

const RegisterFidoModal = ({isWithoutLogin}) => {
    const dispatch = useDispatch();

    const [state, setState] = useState(null);

    useEffect(() => register(), []);

    const register = () => {
        setState(State.Loading);
        dispatch(registerFido(isWithoutLogin))
            .then((response) => {
                setState(State.Success);
                setTimeout(() => {
                    dispatch(showModal(EditDeviceNameModal, {isCreate: true, credential: response, isWithoutLogin: isWithoutLogin}))
                }, 1000);
            })
            .catch(err => {
                setState(State.Error);
            });
    }

    const close = () => {
        dispatch(hideModal());
    }

    const renderBody = () => {
        if (state === State.Error) return <ErrorContent onRetry={() => register()} />;
        if (state === State.Loading) return <FidoLoadingContent />;
        if (state === State.Success) return <FidoSuccessContent />;
    }

    return (
        <ModalComponent
            className={'custom-modal'}
            title={'Добавление токена'}
            step={2}
            {...(state === State.Error && {footerLinks: [{onClick: () => close(), label: 'Закрыть'}]})}
        >
            {renderBody()}
        </ModalComponent>
    )
}

export default RegisterFidoModal;