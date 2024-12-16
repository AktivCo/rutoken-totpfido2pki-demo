import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';

import { loginFido, loginWithoutTwoFactor } from "../actions";
import { State } from "../utils/constants";
import ModalComponent from "../modal/ModalComponent";
import FidoErrorContent from "../components/fido/FidoErrorContent";
import FidoSuccessContent from "../components/fido/FidoSuccessContent";
import FidoLoadingContent from "../components/fido/FidoLoadingContent";

const LoginFIDO = () => {
    const dispatch = useDispatch();
    const twoFactorType = useSelector(state => state.twoFactorType);

    const [state, setState] = useState(null);

    useEffect(() => loginFIDO(), [twoFactorType]);

    const loginFIDO = () => {
        setState(State.Loading);

        dispatch(loginFido())
            .then((response) => {
                setState(State.Success);
            })
            .catch(err => {
                setState(State.Error);
            });
    }

    const renderBody = () => {
        if (state === State.Error) return <FidoErrorContent onRetry={() => loginFIDO()} onBack={() => dispatch(loginWithoutTwoFactor())} />;
        if (state === State.Loading) return <FidoLoadingContent />;
        if (state === State.Success) return <FidoSuccessContent />;
    }

    return (
        <ModalComponent
            title={"Подключение к токену"}
            withLabel
            backdrop={false}
            fade={false}
        >
            {renderBody()}
        </ModalComponent>
    )
}

export default LoginFIDO;