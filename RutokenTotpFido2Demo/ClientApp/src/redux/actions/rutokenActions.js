import axios from "axios";
import { setLoginState } from ".";

const SET_RUTOKEN_INFO = (param) => ({
    type: 'SET_RUTOKEN_INFO',
    payload: param
});


const setRutokenInfo = (param) => {
    return (dispatch) => {
        dispatch(SET_RUTOKEN_INFO(param));
    }
}

const loginByCert = () => {
    return (dispatch, getState) => {
        const { deviceId, certId } = getState().rutokenInfo;
        const { instance } = getState().plugin;

        axios.get('/pki/random')
            .then((response) => {
                const random = response.data;
                const options = {
                    detached: false,
                    addUserCertificate: true,
                    useHardwareHash: false,
                };

                // PIN Required - Uncomment later
                const sign = instance.sign(deviceId, certId, random, false, options);
                // const sign = response.data;
                return sign;
            })
            .then(sign => {
                const certLoginModel = {
                    cms: sign,
                    certId: certId
                };
                return axios.post('/pki/login', certLoginModel);
            })
            .then(() => dispatch(setLoginState(true)));
    }
};

export {
    setRutokenInfo,
    loginByCert
};