import React, {useEffect, useState} from "react";
import StepContainer from "../StepContainer";
import {Form, FormGroup, Input, Label} from "reactstrap";
import {useDispatch} from "react-redux";
import {checkTotp, registerTotp} from "../../redux/actions";
import CommonButton from "../../common/CommonButton";


const RenderError = ({error}) => {
    console.log(error);
    if (!error) return null;
    if (!error.hasOwnProperty('message')) {
        return (
            <div className="text-danger ms-3">
                <small>
                    Неверный одноразовый пароль.
                        <br />
                    Повторите попытку ввода.
                </small>
            </div>
        )
    }

    return (
        <div className="text-danger ms-3">
            <small> {error.message}</small>
        </div>
    )

}
const InitTotpStepFour = ({currentStep}) => {
    const dispatch = useDispatch();

    const [totpPassword, changeTotpPassword] = useState('');
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setError(null);
        setVerified(false);
        changeTotpPassword('');

    }, [currentStep])

    const check = () => {
        setError(null);
        setVerified(false);

        dispatch(checkTotp(totpPassword))
            .then(() => {
                setVerified(true);
            })
            .catch(() => {
                setError({});
            });
    }

    const onSubmit = (evt) => {
        evt.preventDefault();
        if (!verified) {
            check();
            return;
        }
        register();
    }

    const register = () => {
        dispatch(registerTotp())
            .catch((err) => {
                setVerified(false);
                setError(err.response.data);
            });
    }

    return (
        <StepContainer
            stepId={4}
            header={"Проверьте одноразовый пароль"}
            currentStep={currentStep}
        >
            <div>
                Нажмите кнопку на корпусе Рутокен OTP <br/>
                и введите отобразившиеся цифры в поле.
            </div>
            <Form className="mt-3" onSubmit={(evt) => onSubmit(evt)}>
                <div className="d-flex flex-column">
                    <Label for="secret" className="totp-label mr-sm-2">Одноразовый пароль</Label>
                    <div className="d-flex align-items-center gap-1_25rem">
                        <FormGroup className="col-md-5 small-fs mb-none">
                            <Input
                                maxLength={6}
                                type="text"
                                className="form-control totp-input-invalid mb-0"
                                name="select" value={totpPassword}
                                invalid={error}
                                autoFocus
                                onChange={(evt) => changeTotpPassword(evt.target.value)}
                            />
                        </FormGroup>
                        <FormGroup className="col-md-6 mb-none d-flex align-items-center">
                            <div className="text-center d-block">
                                <span className="modal-footer-link fw-bolder cursor-pointer"
                                    onClick={() => check()}
                                >
                                    Проверить
                                </span>
                            </div>
                        </FormGroup>
                    </div>
                </div>
            </Form>
            {
                error && (
                    <div className="mt-0_375rem">
                        <RenderError error={error}></RenderError>
                        <div className="d-block mt-2">
                            <a className="fw-bolder cursor-pointer"
                               href="https://dev.rutoken.ru/x/Q4D0C"
                               target="_blank"
                            >
                                Подробнее о возможных ошибках
                            </a>
                        </div>
                    </div>
                )
            }
            {
                verified && (
                    <small className="text-success d-block ps-3 mt-0_375rem">
                        Одноразовый пароль верный
                    </small>
                )
            }
            <CommonButton onClick={register} disabled={error || !verified} className="mt-4">
                Добавить Рутокен OTP
            </CommonButton>
        </StepContainer>

    );
};

export default InitTotpStepFour;