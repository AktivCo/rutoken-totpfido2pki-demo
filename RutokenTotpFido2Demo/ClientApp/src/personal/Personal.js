import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import cn from "classnames";

import {getUserInfo, signOut} from "../redux/actions";

import Layout from "../common/Layout";
import InitFido from "./fido/InitFido";
import InitTotp from "./totp/InitTotp";
import RenderFidoKeysList from "./fido/RenderFidoKeysList";
import RenderTotpKeysList from "./totp/RenderTotpKeysList";
import { LogoutIcon } from "../controls/LogoutIcon"
import { Factor, Status } from "../utils/constants";
import PKIDevices from "./pki/PKIDevices";
import PKIBindInit from "./pki/PKIBindInit";
import RenderTwoFactorInit from "./RenderTwoFactorInit";


const RenderTwoFactor = ({fidoKeys, totpKeys, pkiKeys}) => {
    const renderStatus = () => cn({
        "personal-two-factor__value ": true,
        "personal-two-factor__value--on": fidoKeys.length || totpKeys.length || pkiKeys.length
    });

    const getStatus = () => {
        if (fidoKeys.length) return 'Включена (Рутокен MFA)';
        if (totpKeys.length) return 'Включена (Рутокен OTP)';
        if (pkiKeys.length) return 'Включена (Рутокен ЭЦП)';
        return 'Выключена';
    }

    return (
        <div className="personal-two-factor">
            <div className="personal-two-factor__text">
                Двухфакторная защита учетной записи:
            </div>

            <div className={renderStatus()}>
                {getStatus()}
            </div>
        </div>
    );
}



const DevicesContainer = ({ fidoKeys, totpKeys, pkiKeys }) => {

    if (fidoKeys.length) {
        return <RenderFidoKeysList keys={fidoKeys} />;
    }

    if (totpKeys.length) {
        return <RenderTotpKeysList keys={totpKeys} />;
    }

    if (pkiKeys.length) {
        return (
            <PKIDevices />
        );
    }

    return <RenderTwoFactorInit></RenderTwoFactorInit>;
}

const Personal = () => {
    const userInfo = useSelector(state => state.userInfo);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUserInfo());
    }, []);

    if (!userInfo) return <></>;

    const renderDateLeft = () => {
        if (userInfo.hoursLeft == 0) return `${userInfo.minutesLeft} м.`;
        return `${userInfo.hoursLeft} ч. ${userInfo.minutesLeft} м.`;
    }

    return (
        <Layout>
            <div className="personal">
                <div className="personal-heading">Личный кабинет</div>
                <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <div className="personal-info">
                            <div className="personal-info__logo"></div>
                            <div className="personal-info__name">{userInfo.userName}</div>
                        </div>
                        <div className="personal-logout" onClick={() => dispatch(signOut())}>
                            <div className="personal-logout__text">Выйти</div>
                            <div className="personal-logout__logo"></div>
                            <LogoutIcon></LogoutIcon>
                        </div>
                    </div>
                    <div className="personal-expiration">
                        <div className="personal-expiration__text">Срок действия учeтной записи:</div>
                        <div className="personal-expiration__value">{renderDateLeft()}</div>
                    </div>
                    <RenderTwoFactor {...userInfo} />
                </div>
                <DevicesContainer {...userInfo} />
            </div>
        </Layout>
    );
}

export default Personal;
