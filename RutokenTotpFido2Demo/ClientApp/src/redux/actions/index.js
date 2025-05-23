import axios from "axios";
import {coerceToArrayBuffer, coerceToBase64Url} from "../../utils/utils";
import { setLoginState, setTotpParams, setTwoFactorType, setUserInfo } from "../actionCreators";


const checkLoginState = () => {

    return (dispatch) => {
        let sequense = Promise.resolve();

        sequense = sequense.then(() => {
            return axios.get('/user/loginstate', {});
        });

        sequense = sequense
            .then(() => dispatch(setLoginState(true)))
            .catch(() => {
            });

        return sequense;
    };
}

const signInOrUp = (toSingUp, userName, password, repeatPassword) => {
    return (dispatch, getState) => {

        let sequense;

        let model = {
            userName: userName,
            password: password
        }

        if (toSingUp) {
            model.repeatPassword = repeatPassword;
            sequense = axios.post('/user/register', model);
        } else {
            sequense = axios.post('/user/login', model);

            sequense = sequense
                .then(({data: result}) => {
                    if (result.twoFactorType) {
                        dispatch(setTwoFactorType(result.twoFactorType));
                    }
                });
        }

        sequense = sequense.then(() => {
            if (getState().twoFactorType) return;
            dispatch(setLoginState(true));
        });


        sequense = sequense.catch(err => {
            return Promise.reject(err.response.data);
        });

        return sequense;
    };
}

const signOut = () => {
    return () => {

        let sequense = Promise.resolve();

        sequense = sequense.then(() => axios.get('/user/logout'));

        sequense = sequense.then(() => window.location.href = '/');

        return sequense;
    };
}

const getUserInfo = () => {
    return (dispatch) => {
        let sequense = Promise.resolve();

        sequense = sequense.then(() => axios.get('/user/info'));

        sequense = sequense
            .then((response) => dispatch(setUserInfo(response.data)));

        return sequense;
    };
}

const registerTotp = () => {
    return (dispatch, getState) => {
        let sequense = Promise.resolve();

        sequense = sequense.then(() => axios.post('/totp/register', getState().totpParams));

        sequense = sequense
            .then((response) => getUserInfo()(dispatch));

        return sequense;
    };
}

const removeTotp = (key) => {
    return (dispatch) => {
        let sequense = Promise.resolve();

        sequense = sequense.then(() => axios.get(`/totp/remove/${key.id}`));

        sequense = sequense
            .then((response) => getUserInfo()(dispatch));

        return sequense;
    };
}

const getSecret = () => {
    return (dispatch) => {
        let sequense = Promise.resolve();

        sequense = sequense.then(() => axios.get(`/totp/getsecret`));

        sequense = sequense
            .then((response) => response.data);

        return sequense;

    };
}

const getQrCodeLink = () => {
    return (dispatch, getState) => {

        let sequense = Promise.resolve();

        sequense = sequense.then(() => axios.post(`/totp/qr`, getState().totpParams));

        sequense = sequense
            .then((response) => response.data);

        return sequense;

    };
}

const checkTotp = (totpPassword) => {
    return (dispatch, getState) => {

        const checkParams = {
            ...getState().totpParams,
            totpPassword
        }

        let sequense = Promise.resolve();

        sequense = sequense.then(() => axios.post(`/totp/check`, checkParams));

        sequense = sequense
            .then((response) => response.data);

        return sequense;

    };
}

const cacheTotpParams = (params) => (dispatch) => {
    return Promise.resolve(dispatch(setTotpParams(params)));
}

const verifyTotp = (code) => {
    return () => axios.post('/totp/verify', {code});
}

const registerFido = (isWithoutLogin) => {
    return (dispatch) => {
        let sequense = Promise.resolve();

        sequense =
            sequense.then(() => axios.post('/mfa/makecredentialoptions', {isWithoutLogin}));

        sequense = sequense.then((response) => {

            let option = JSON.parse(response.data);
            if (option.status !== "ok")
                throw new Error("Ошибка регистрации токена");

            option.challenge = coerceToArrayBuffer(option.challenge);
            option.user.id = coerceToArrayBuffer(option.user.id);
            option.excludeCredentials = option.excludeCredentials.map((x) => {
                x.id = coerceToArrayBuffer(x.id);
                return x;
            });
            if (option.authenticatorSelection.authenticatorAttachment === null)
                option.authenticatorSelection.authenticatorAttachment = undefined;

            return option;
        });

        sequense = sequense.then((response) => {
            return navigator.credentials.create({
                publicKey: response
            });
        });

        sequense = sequense.catch((error) => {
            throw error;
        });

        return sequense;
    };
}

const loginFido = () => {
    return (dispatch) => {
        let sequense = axios.get('/mfa/assertionoptions');

        sequense = sequense.then((result) => {

            const data = result.data;
            const publicKey = {
                ...data,
                allowCredentials: data.allowCredentials.map(el => ({
                    id: coerceToArrayBuffer(el.id),
                    type: el.type
                })),
                challenge: coerceToArrayBuffer(data.challenge)
            };


            return navigator.credentials.get({publicKey});
        });

        sequense = sequense.then((assertedCredential) => {

            let authData = new Uint8Array(assertedCredential.response.authenticatorData);
            let clientDataJSON = new Uint8Array(assertedCredential.response.clientDataJSON);
            let rawId = new Uint8Array(assertedCredential.rawId);
            let sig = new Uint8Array(assertedCredential.response.signature);
            const data = {
                id: assertedCredential.id,
                rawId: coerceToBase64Url(rawId),
                type: assertedCredential.type,
                extensions: assertedCredential.getClientExtensionResults(),
                response: {
                    authenticatorData: coerceToBase64Url(authData),
                    clientDataJSON: coerceToBase64Url(clientDataJSON),
                    signature: coerceToBase64Url(sig)
                }
            };

            return axios.post('/mfa/makeassertion', data);
        });

        sequense = sequense.then((result) => {

            setTimeout(() => dispatch(setLoginState(true)), 1000);
        });

        sequense = sequense.catch((error) => {
            throw error;
        });


        return sequense;
    };
}

const loginPasswordLess = () => {
    return (dispatch) => {
        dispatch(setTwoFactorType("FIDO"));
    }
}

const loginPki = () => {
    return (dispatch) => {
        dispatch(setTwoFactorType("PKINoLoginBefore"));
    }
}

const loginWithoutTwoFactor = () => {
    return (dispatch) => {
        dispatch(setTwoFactorType(null));
    }
}

const confirmRegisterFido = (credential, label, isWithoutLogin) => {
    return (dispatch) => {
        let sequense = Promise.resolve();

        let attestationObject = new Uint8Array(credential.response.attestationObject);
        let clientDataJSON = new Uint8Array(credential.response.clientDataJSON);
        let rawId = new Uint8Array(credential.rawId);

        const attestationResponse = {
            id: credential.id,
            rawId: coerceToBase64Url(rawId),
            type: credential.type,
            extensions: credential.getClientExtensionResults(),
            response: {
                AttestationObject: coerceToBase64Url(attestationObject),
                clientDataJson: coerceToBase64Url(clientDataJSON)
            }
        };

        sequense = sequense.then(() => axios.post('/mfa/makecredential', {attestationResponse, label, isWithoutLogin}));

        sequense = sequense.then((response) => {
            let result = response.data;
            if (result.status !== "ok")
                throw new Error("Ошибка подтверждения регистрации токена");

            return result;
        });

        sequense = sequense.then((response) => getUserInfo()(dispatch));

        return sequense;
    };
}

const renameDeviceFido = (id, label) => {
    return (dispatch) => {
        let sequense = Promise.resolve();

        sequense = sequense.then(() => axios.post('/mfa/renamedevice', {id, label}));

        sequense = sequense.then((response) => getUserInfo()(dispatch));

        return sequense;
    };
}

const deleteDeviceFido = (id) => {
    return (dispatch) => {
        let sequense = Promise.resolve();

        sequense = sequense.then(() => axios.post('/mfa/deletefidokey', null, {params: {id: id}}));

        sequense = sequense.then((response) => getUserInfo()(dispatch));

        return sequense;
    };
}

export {
    signInOrUp,
    signOut,
    setLoginState,
    checkLoginState,
    getUserInfo,

    getSecret,
    getQrCodeLink,
    registerTotp,
    removeTotp,
    cacheTotpParams,
    checkTotp,
    verifyTotp,

    registerFido,
    confirmRegisterFido,
    renameDeviceFido,
    deleteDeviceFido,

    loginFido,
    loginPasswordLess,
    loginPki,
    loginWithoutTwoFactor,
};