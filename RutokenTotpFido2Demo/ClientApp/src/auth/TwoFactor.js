import React from "react";
import LoginFIDO from "./LoginFido";
import LoginTOTP from "./LoginTotp";
import LoginRutoken from "./LoginRutoken";


const TwoFactorContainer = ({type}) => {
    if (type === 'FIDO') return <LoginFIDO/>;
    if (type === 'TOTP') return <LoginTOTP/>;
    if (type === 'RUTOKEN') return <LoginRutoken/>;

    return null;
};


export default TwoFactorContainer;