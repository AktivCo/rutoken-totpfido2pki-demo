import Plugin from '@aktivco-it/rutoken-plugin-bootstrap/src/index';
import { setPluginLoadError, setPKIDevicesLoaded, setPluginLoaded, setPluginLoading, setPKIDevicesLoading, setPKIDevicesLoadError, setLoginState } from '../actionCreators';
import axios from 'axios';
import { getRutokenModelName } from '../../utils/getRutokenModelName';

export const loadPlugin = () => {
    return (dispatch) => {
        dispatch(setPluginLoading())

        return (Plugin.init()
            .then((data) => dispatch(setPluginLoaded(data)))
            .catch((error) => dispatch(setPluginLoadError(error))));
    }
};

export const getPKIDevices = () => {
    return (dispatch, getState) => {
        dispatch(setPKIDevicesLoading());
        const plugin = getState().plugin.instance;

        const tokenInfos = [
            plugin.TOKEN_INFO_SERIAL,
            plugin.TOKEN_INFO_PINS_INFO,

            plugin.TOKEN_INFO_SUPPORTED_MECHANISMS,
            plugin.TOKEN_INFO_FEATURES,
            plugin.TOKEN_INFO_SPEED
        ];

        return plugin.enumerateDevices()
            .then((deviceIds) => Promise.all(deviceIds.map((deviceId) => {
                return Promise.all(tokenInfos.map(tokenInfo => plugin.getDeviceInfo(deviceId, tokenInfo)))
                    .then((tokenInfos) => {
                        const device = {
                            deviceId: deviceId,
                            serial: tokenInfos[0],
                            isPinCached: tokenInfos[1].isPinCached,
                            pinRetriesLeft: tokenInfos[1].retriesLeft,

                            mechanisms: tokenInfos[2],
                            features: tokenInfos[3],
                            speed: tokenInfos[4]
                        };

                        const modelName = getRutokenModelName(device, plugin);
                        return {...device, modelName };    
                    })
                    .then((device) => {
                        return plugin.enumerateCertificates(device.deviceId, plugin.CERT_CATEGORY_USER)
                            .then((certIds) => {
                                return Promise.all(certIds.map((certId) =>
                                    plugin.parseCertificate(deviceId, certId)
                                        .then((certificate) => ({
                                            ...certificate,
                                            certId: certId,
                                            issuerProp: Object.assign({}, ...certificate.issuer.map(is => ({ [is.rdn]: is.value }))),
                                            subjectProp: Object.assign({}, ...certificate.subject.map(is => ({ [is.rdn]: is.value }))),
                                        }))
                                ))
                            })
                            .then((certs) => ({ ...device, certs }))
                    })
                })
            ))
            .then(devices => {
                const certsIds = devices.map(device => device.certs.map(cert => cert.certId)).flat(1);
                return axios.post('/pki/certs', certsIds)
                    .then(({ data: dbCerts }) => {
                        return devices.map(device => ({
                            ...device, 
                            certs: device.certs
                                .map(cert => ({
                                    ...cert,
                                    lastLoginDate: dbCerts[cert.certId]?.lastLoginDate ?? null
                                }))
                                .toSorted((a, b) => new Date(b.lastLoginDate) - new Date(a.lastLoginDate))
                        }))
                    })
            })
            .then((devices) => dispatch(setPKIDevicesLoaded(devices)))
            .catch((error) => dispatch(setPKIDevicesLoadError(error)))
    }
};

export const loginByCert = () => {
    return (dispatch, getState) => {
        const { deviceId, certId } = getState().pkiAuthData;
        const { instance: plugin } = getState().plugin;

        axios.get('/pki/random')
            .then((response) => {
                const random = response.data;
                const options = {
                    detached: false,
                    addUserCertificate: true,
                    useHardwareHash: false,
                };

                return plugin.sign(deviceId, certId, random, plugin.DATA_FORMAT_PLAIN, options);
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