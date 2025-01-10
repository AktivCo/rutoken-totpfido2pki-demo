import React, { useState } from "react";
import { useDispatch } from 'react-redux';

import { setLoginState, loginWithoutTwoFactor, verifyTotp } from "../redux/actions";
import { Form, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import ModalComponent from "../modal/ModalComponent";
import { Status } from "../utils/constants";

const LoginTOTP = () => {
    const dispatch = useDispatch();

    const [status, setStatus] = useState(null);
    const [errorMsg, setErrorMsg] = useState(false);
    const [isVerified, setIsVerified] = useState(null);
    const [code, setCode] = useState("");

    const handleCodeChange = (e) => {
        const value = e.target.value;

        if (/^[0-9]*$/.test(value)) {
            setCode(value);
        }
    }; 

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus(Status.Loading);

        dispatch(verifyTotp(code))
            .then((response) => {
                setIsVerified(response.data);

                if (response.data) {
                    dispatch(setLoginState(true));
                }
            })
            .catch((error) => {
                setErrorMsg(error?.response?.data?.message);
                setStatus(Status.Error);
            })
            .finally(() => setStatus(null));
    }

    const renderBody = () => {
        return (
            <div className="d-flex flex-column align-items-center w-100 mb-2">
                <div className="text-center text-secondary mb-4">
                    <small>Нажмите кнопку на корпусе Рутокен<br />OTP и введите отобразившиеся<br />цифры в поле</small>
                </div>
                <Form className="w-100">
                    {status == Status.Error && !errorMsg && <div className='invalid-feedback d-block mb-2 mx-3'>Внутренняя ошибка.<br/>Повторите запрос позже</div>}
                    <FormGroup>
                        <Label for="totpCode" className="ps-3 text-secondary">
                            <small>Одноразовый пароль</small>
                        </Label>
                        <Input
                            type="text" 
                            maxLength="6"
                            id="totpCode"
                            name="totpCode"
                            placeholder="Одноразовый пароль"
                            value={code} 
                            onChange={handleCodeChange}
                            onFocus={() => setIsVerified(null)}
                            invalid={isVerified === false}
                            style={{backgroundImage: "none"}}
                            disabled={status}
                        />
                        {
                            (errorMsg) ?
                                <small className="d-block text-center text-danger">{errorMsg}</small> :
                                <FormFeedback className="ps-3">
                                    Введен неверный одноразовый пароль.<br />Повторите попытку
                                </FormFeedback>
                        }
                    </FormGroup>
                </Form>
            </div>
        );
    }
    
    return (
        <ModalComponent
            title={"Двухфакторная аутентификация"}
            withLabel
            onSubmit={handleSubmit}
            footerLinks={[{onClick: () => dispatch(loginWithoutTwoFactor(null)), label: 'Назад'}]}
            backdrop={false}
            fade={false}
        >
            {renderBody()}
        </ModalComponent>
    )
}

export default LoginTOTP;
