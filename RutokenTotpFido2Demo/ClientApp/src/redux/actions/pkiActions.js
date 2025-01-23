import Plugin from '@aktivco-it/rutoken-plugin-bootstrap/src/index';
import {
    setPluginLoadError,
    setPluginLoadSuccess,
    setPluginLoadStart,
    setLoginState,
    setPkiAuthData,
    setPluginOperationStart,
    setPluginOperationSuccess,
    setPluginOperationError,
    setPluginDevicesLoadSuccess
} from '../actionCreators';
import axios from 'axios';
import { getUserInfo } from '.';
import { getRutokenModelName } from '../../utils/getRutokenModelName';

const hexToBigIntString = (hexString) => {
    const hex = hexString.replaceAll(':', '');
    if (hex.length % 2) { hex = '0' + hex; }

    const bn = BigInt('0x' + hex);

    return bn.toString(10);
}

export const loadPlugin = (rethrow = true) => {
    return (dispatch, getState) => {
        const plugin = getState().plugin.instance;
        if (plugin) return Promise.resolve(plugin);

        dispatch(setPluginLoadStart());
        return (Plugin.init()
            .then((plugin) => {
                dispatch(setPluginLoadSuccess(plugin));
                return plugin;
            })
            .catch((error) => {
                dispatch(setPluginLoadError(error));
                if (rethrow) throw error;
            }));
    }
};

export const getPkiDevices = () => {
    return (dispatch) => {
        dispatch(setPluginOperationStart());

        return dispatch(loadPlugin())
            .then((plugin) => {
                const tokenInfos = [
                    plugin.TOKEN_INFO_SERIAL,
                    plugin.TOKEN_INFO_SUPPORTED_MECHANISMS,
                    plugin.TOKEN_INFO_FEATURES,
                    plugin.TOKEN_INFO_SPEED,
                ];

                return plugin.enumerateDevices()
                    .then((deviceIds) => Promise.all(deviceIds.map((deviceId) => {
                        return Promise.all(tokenInfos.map(tokenInfo => plugin.getDeviceInfo(deviceId, tokenInfo)))
                            .then((tokenInfos) => {
                                const device = {
                                    deviceId: deviceId,
                                    serial: tokenInfos[0],
                                    mechanisms: tokenInfos[1],
                                    features: tokenInfos[2],
                                    speed: tokenInfos[3]
                                };

                                const modelName = getRutokenModelName(device, plugin);
                                return {...device, modelName };    
                            })
                            .then((device) => {
                                return plugin.enumerateCertificates(device.deviceId, plugin.CERT_CATEGORY_USER)
                                    .then((certIds) => {
                                        return Promise.all(certIds.map((certId) =>
                                            plugin.parseCertificate(deviceId, certId)
                                                .then((certificate) => {
                                                  return  {
                                                    ...certificate,
                                                    certId: certId,
                                                    serial: hexToBigIntString(certificate.serialNumber),
                                                    subjectProp: Object.assign({}, ...certificate.subject.map(is => ({ [is.rdn]: is.value }))),
                                                }
                                            })
                                        ))
                                    })
                                    .then((certs) => ({ ...device, certs }))
                            })
                        })
                    ))
                    .then(devices => {
                        const serialNumbers = devices.map(device => device.certs.map(cert => cert.serial)).flat(1);
                        return axios.post('/pki/certs', serialNumbers)
                            .then(({ data: dbCerts }) => {
                                return devices.map(device => ({
                                    ...device, 
                                    certs: device.certs
                                        .filter(cert => dbCerts.hasOwnProperty(cert.serial))
                                        .map(cert => ({
                                            ...cert,
                                            lastLoginDate: dbCerts[cert.serial]
                                        }))
                                        .toSorted((a, b) => new Date(b.lastLoginDate) - new Date(a.lastLoginDate))
                                }))
                            })
                    })
                    .then((devices) => dispatch(setPluginDevicesLoadSuccess(devices)))
            })
            .catch((error) => dispatch(setPluginOperationError(error)));
    }
};

export const loginByCert = () => {
    return (dispatch, getState) => {
        dispatch(setPluginOperationStart());
        const { deviceId, certId } = getState().pkiAuthData;

        return dispatch(loadPlugin())
            .then((plugin) => {
                return axios.get('/pki/random')
                    .then(({data: random}) => {
                        const options = {
                            detached: false,
                            addUserCertificate: true,
                            useHardwareHash: false,
                        };
        
                        return plugin.sign(deviceId, certId, random, plugin.DATA_FORMAT_PLAIN, options);
                    })
                    .then(cms => axios.post('/pki/login', {cms} ))
                    .then(() => dispatch(setLoginState(true)))
                    .then(() => dispatch(setPluginOperationSuccess()))
                    .catch((error) => dispatch(setPluginOperationError(error)));
            })
    }
};

export const bindPki = (onSuccess) => {
    return (dispatch, getState) => {
        dispatch(setPluginOperationStart());
        const { deviceId } = getState().pkiAuthData;
        const { userName } = getState().userInfo;

        return dispatch(loadPlugin())
            .then((plugin) => {
                const date = new Date();

                const [year, month, day] = [
                    ('0' + date.getFullYear()).slice(-2),
                    ('0' + date.getMonth() + 1).slice(-2),
                    ('0' + date.getDate()).slice(-2),
                ];
                
                const [hour, minutes, seconds, milliseconds] = [
                    ('0' + date.getHours()).slice(-2),
                    ('0' + date.getMinutes()).slice(-2),
                    ('0' + date.getSeconds()).slice(-2),
                    ('00' + date.getMilliseconds()).slice(-3),
                ];
        
                const name = `DemoAuth${year}${month}${day}${hour}${minutes}${seconds}${milliseconds}`;
        
                const id = name.split('').map((x) => x.charCodeAt(0).toString(16)).join(':');

                const options = {
                    id: id,
                    publicKeyAlgorithm: plugin.PUBLIC_KEY_ALGORITHM_GOST3410_2012_256,
                    signatureSize: 512,
                    paramset: 'A',
                    keyType: plugin.KEY_TYPE_COMMON,
                };

                return plugin.generateKeyPair(deviceId, undefined, '', options)
                    .then((keyId) => {
                        const subject = [
                            {
                                rdn: 'commonName',
                                value: userName,
                            },
                        ];
                
                        const extensions = {
                            keyUsage: [
                                'digitalSignature',
                                'nonRepudiation',
                            ]
                        };
        
                        const options = {
                            "hashAlgorithm": plugin.HASH_TYPE_GOST3411_12_256,
                        };
        
                        return plugin.createPkcs10(deviceId, keyId, subject, extensions, options);
                    })
                    .then((pkcs10Request) => axios.post('/pki/register', { pem: pkcs10Request }))
                    .then((cert) => plugin.importCertificate(deviceId, cert, plugin.CERT_CATEGORY_USER))
                    .then((certId) => dispatch(setPkiAuthData(deviceId, certId)))
                    .then(() => dispatch(loginByCert()))
                    .then(() => dispatch(getUserInfo()))
                    .then(() => dispatch(setPluginOperationSuccess()))
                    .then(onSuccess);
            })
            .catch((error) => dispatch(setPluginOperationError(error)));
    }
};

export const deletePki = (certSerial) => {
    return async (dispatch) => {
        await axios.delete(`pki/certs/${certSerial}`);
        return dispatch(getUserInfo());
    }
}