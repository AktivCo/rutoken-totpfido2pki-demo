import React, {useState, useMemo} from "react";
import {useDispatch} from 'react-redux';


import {signInOrUp, loginPasswordLess, loginRutoken} from "../actions";
import PasswordInput from "../controls/PasswordInput";
import {FormFeedback, Input} from "reactstrap";
import ModalComponent from "../modal/ModalComponent";


const Login = () => {
    const [isRegisterView, setIsRegisterView] = useState(false);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState(null);

    const dispatch = useDispatch();

    const registerViewToggle = () => {
        setError(null);
        setUserName("");
        setPassword("");
        setRepeatPassword("");
        setIsRegisterView(!isRegisterView);
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        setError(null);

        dispatch(signInOrUp(isRegisterView, userName, password, repeatPassword))
            .catch(err => {
                setError(err);
            });
    }

    const isContinueDisable = useMemo(() => {
        if (isRegisterView)
            return !userName || !password || !repeatPassword;
        else
            return !userName || !password;
    }, [userName, password, repeatPassword, isRegisterView]);

    const handleUserNameChange = (evt) => setUserName(evt.target.value);
    const handlePasswordChange = (evt) => setPassword(evt.target.value);
    const handleRepeatPasswordChange = (evt) => setRepeatPassword(evt.target.value);

    const renderBody = () => {
        return (
            <form className="w-100">
                <div className="form-group mt-3">
                    <Input 
                        type="text" 
                        maxLength="20"
                        className="form-control" 
                        placeholder="Логин"
                        value={userName}
                        invalid={error && error.payload && error.payload.name === 'login'}
                        onChange={handleUserNameChange}
                        style={{backgroundImage: "none"}}
                    />
                    <FormFeedback className="ps-3">
                        {error && error.payload && error.message}
                    </FormFeedback>
                </div>
    
                <div className="form-group mt-0_75rem">
                    <PasswordInput
                        maxLength="20"
                        className="form-control pe-2_25rem" 
                        placeholder="Пароль"
                        value={password}
                        style={{backgroundImage: "none"}}
                        invalid={error && error.payload && error.payload.name === 'password'}
                        onChange={handlePasswordChange}
                        feedback={error && error.payload && error.message}
                    />
                </div>
    
                {
                    !isRegisterView &&
                    <div className="form-group my-4">
                        <a className="text-secondary cursor-pointer"
                            onClick={() => registerViewToggle()}>
                            <small>У меня нет учетной записи</small>
                        </a>
                    </div>
                }
    
                {
                    isRegisterView &&
                    <>
                        <div className="form-group mt-0_75rem">
                            <PasswordInput
                                maxLength="20"
                                className="form-control" 
                                placeholder="Повторите пароль"
                                style={{backgroundImage: "none"}}
                                value={repeatPassword} 
                                invalid={error && error.payload && error.payload.name === 'repeatPassword'}
                                onChange={handleRepeatPasswordChange}
                                feedback={error && error.payload && error.message}
                            />
                        </div>
                        <div className="form-group my-4">
                            <small className="text-secondary">
                                Через <span className="fw-bolder">48 часов</span> личный
                                кабинет будет удален,
                                потребуется новая регистрация
                            </small>
                        </div>
                    </>
    
                }
            </form>
        );
    }

    const getFooterLinks = () => {
        if (isRegisterView) return [
            {
                onClick: () => registerViewToggle(),
                label: 'У меня есть учетная запись'
            }
        ];

        return [
            {
                onClick: () => dispatch(loginPasswordLess()),
                label: 'Без логина и пароля (MFA)'
            }, 
            {
                onClick: () => dispatch(loginRutoken()),
                label: 'По сертификату'
            }
        ];
    }

    return (
        <ModalComponent
            title={isRegisterView ? 'Регистрация' : 'Вход в личный кабинет'}
            withLabel
            onSubmit={handleSubmit}
            submitButtonText={isRegisterView ? 'Зарегистрироваться' : 'Продолжить'}
            submitButtonDisabled={isContinueDisable}
            withDelimeter={!isRegisterView}
            footerLinks={getFooterLinks()}
            {...(error && !error.payload && {footerError: error.message})}
            backdrop={false}
            fade={false}
        >
            {renderBody()}
        </ModalComponent>
    );
}

export default Login;