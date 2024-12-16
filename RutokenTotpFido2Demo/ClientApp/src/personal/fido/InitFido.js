import React, { useState } from "react";
import {useDispatch, useSelector} from "react-redux";

import RegisterFidoModal from "./RegisterFidoModal";
import {showModal} from "../../actions";
import CustomSwitch from "../../controls/Switch/CustomSwitch";
import { Button } from "reactstrap";

const InitFido = ({setVisible}) => {
    const dispatch = useDispatch();

    const fidoKeys = useSelector(state => state.userInfo.fidoKeys);
    
    const [isWithoutLogin, setIsWithoutLogin] = useState(false);

    const registerFidoDevice = () => {
        dispatch(showModal(RegisterFidoModal, {isWithoutLogin: isWithoutLogin}));
    }

    const close = () => {
        setVisible(false);
    }

    return (
        <div className='mfa-step-one gap-3'>
            {
                fidoKeys.length > 0 &&
                <div className='d-flex align-items-center justify-content-between gap-0_25rem'>
                    <div className='personal-add-device-header'>Добавить второй фактор защиты</div>
                    <div className='personal-logout personal-logout__text'
                            onClick={() => close()}
                    >
                        Отменить
                    </div>
                </div>
            }
            <div className='d-flex flex-column'>
                <div className='step-mfa'>ШАГ 1</div>
                <div className='personal-add-device-header'>Подключите устройство</div>
            </div>
            <div className='d-flex flex-column gap-3'>
                <div className='image-mfa'></div>
                <div className='brief-mfa'>
                    <div>Подключите Рутокен MFA к компьютеру и нажмите <b>«Добавить»</b>.</div>
                    <div>Когда появится индикация, нажмите кнопку на корпусе устройства.</div>
                </div>
            </div>
            <div>
                <div className='without-login'>
                    <div className='without-login-switch'>
                        Вход без логина и пароля
                        <CustomSwitch checked={isWithoutLogin} setChecked={setIsWithoutLogin}></CustomSwitch>
                    </div>
                    {
                        isWithoutLogin &&
                        <div className="without-paswd-text">
                            <div>Беспарольная аутентификация требует поддержки</div>
                            <div>со стороны браузера и операционной системы. 
                                <a className="link-text cursor-pointer ms-1"
                                        href="https://dev.rutoken.ru/pages/viewpage.action?pageId=155942942#id-%D0%9B%D0%B8%D0%BD%D0%B5%D0%B9%D0%BA%D0%B0%D1%82%D0%BE%D0%BA%D0%B5%D0%BD%D0%BE%D0%B2%D0%A0%D1%83%D1%82%D0%BE%D0%BA%D0%B5%D0%BDMFA:%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%D0%B8%D0%B4%D0%B2%D1%83%D1%85%D1%84%D0%B0%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F%D0%B0%D1%83%D1%82%D0%B5%D0%BD%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%86%D0%B8%D1%8F-%D0%9E%D0%BF%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%BD%D1%8B%D0%B5%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D1%8B%D0%B8%D0%B1%D1%80%D0%B0%D1%83%D0%B7%D0%B5%D1%80%D1%8B"
                                      target="_blank">
                                    Подробнее
                                </a>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className='align-self-start'>
                <Button type="submit" color="danger" className="mb-0" onClick={() => registerFidoDevice()}>
                    Добавить Рутокен MFA
                </Button>
            </div>
        </div>
    );
};

export default InitFido;