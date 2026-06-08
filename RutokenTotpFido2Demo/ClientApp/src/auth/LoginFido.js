import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';

import { loginFido, loginWithoutTwoFactor } from "../redux/actions";
import { Status } from "../utils/constants";
import ModalComponent from "../modal/ModalComponent";
import ErrorTokenContent from "../common/ErrorTokenContent";
import FidoSuccessContent from "../components/fido/FidoSuccessContent";
import LoadingContent from "../common/LoadingContent";

const LoginFIDO = () => {
    const dispatch = useDispatch();
    const twoFactorType = useSelector(state => state.twoFactorType);

    const [status, setStatus] = useState(null);

    useEffect(() => loginFIDO(), [twoFactorType]);

    const loginFIDO = () => {
        setStatus(Status.Loading);

        dispatch(loginFido())
            .then(() => {
                setStatus(Status.Success);
            })
            .catch(() => {
                setStatus(Status.Error);
            });
    }

    const renderBody = () => {
        if (status === Status.Error) return <ErrorTokenContent />;
        if (status === Status.Loading) return <LoadingContent />;
        if (status === Status.Success) return <FidoSuccessContent />;
    }

    return (
        <ModalComponent
            title={"Подключение к Рутокену"}
            backdrop={false}
            fade={false}
            {...(status === Status.Error && {onSubmit: () => loginFIDO(), submitButtonText: 'Повторить'})}
            {...(status === Status.Error && {footerLinks: [{onClick: () => dispatch(loginWithoutTwoFactor()), label: 'Назад'}]})}
        >
            {renderBody()}
        </ModalComponent>
    )
}

export default LoginFIDO;