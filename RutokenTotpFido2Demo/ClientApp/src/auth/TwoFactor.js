import React from "react";
import LoginFIDO from "./LoginFido";
import LoginTOTP from "./LoginTotp";
import LoginPKI from "./LoginPKI";


const TwoFactorContainer = ({type}) => {
    if (type === 'FIDO') return <LoginFIDO/>;
    if (type === 'TOTP') return <LoginTOTP/>;
    if (type === 'PKI' || type === 'PKINoLoginBefore') return <LoginPKI/>;

    return null;
};


export default TwoFactorContainer;