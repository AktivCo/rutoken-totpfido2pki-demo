import React, {useState, useRef, useMemo} from "react";
import {useDispatch} from 'react-redux';


import {signInOrUp, loginPasswordLess, loginPki} from "../redux/actions";
import PasswordInput from "../controls/PasswordInput";
import {FormFeedback, Input} from "reactstrap";
import ModalComponent from "../modal/ModalComponent";


const Login = () => {
    const [isRegisterView, setIsRegisterView] = useState(false);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState(null);


    const formRefs= {
        password: useRef(null),
        repeatPassword: useRef(null),
        submit: useRef(null),
    }

    const dispatch = useDispatch();

    const registerViewToggle = () => {
        setError(null);
        setUserName("");
        setPassword("");
        setRepeatPassword("");
        setIsRegisterView(!isRegisterView);
    }

    const handleSubmit = (evt) => {
        if(evt) {
            evt.preventDefault();
        }

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

    const focusRef = (inputId) => {
        if (formRefs[inputId]) {
            formRefs[inputId].current.focus();
        }
    }

    const handleKeyDown = (event) => {
        const isTab = event.key === 'Tab';
        if (event.key !== 'Enter' && !isTab) return;

        event.preventDefault();
        event.stopPropagation();
        const id = event.target.id
        
        if (id === 'login') {
            focusRef('password');
        }    
        else if (isRegisterView && id === 'password') {
            focusRef('repeatPassword');
        }
        else if ((!isRegisterView && id === 'password') || id === 'repeatPassword') { //last input in form
            if(isTab) {
                focusRef('submit');
            }
            else if(!isContinueDisable) {
                handleSubmit();
            }
        }
    };

    const renderBody = () => {
        return (
            <form className="w-100">
                <div className="form-group">
                    <Input 
                        type="text" 
                        maxLength="20"
                        className="form-control" 
                        placeholder="Логин"
                        value={userName}
                        invalid={error && error.payload && error.payload.name === 'login'}
                        onChange={handleUserNameChange}
                        style={{backgroundImage: "none"}}
                        id='login'
                        onKeyDown={handleKeyDown}
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
                        ref={formRefs['password']}
                        id='password'
                        onKeyDown={handleKeyDown}
                    />
                </div>
    
                {
                    !isRegisterView &&
                    <div className="form-group mt-4">
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
                                id='repeatPassword'
                                onKeyDown={handleKeyDown}
                                ref={formRefs['repeatPassword']}
                            />
                        </div>
                        <div className="form-group mt-4">
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
                onClick: () => dispatch(loginPki()),
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
            ref={formRefs['submit']}
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