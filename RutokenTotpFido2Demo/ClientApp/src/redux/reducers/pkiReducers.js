import { Status } from "../../utils/constants";

const pluginInitialState = {
    instance: null,
    status: Status.Idle,
    error: null
}

const plugin = (state = pluginInitialState, action) => {
    switch (action.type) {
        case 'SET_PLUGIN_LOADING':
            return {
                ...pluginInitialState,
                status: Status.Loading,
            };
        case 'SET_PLUGIN_LOADED':
            return {
                ...pluginInitialState,
                instance: action.payload,
            };
        case 'SET_PLUGIN_LOAD_ERROR':
            return {
                ...pluginInitialState,
                status: Status.Error,
                error: action.payload,
            };
        default:
            return state;
    }
}

const devicesInitialState = {
    devices: [],
    status: Status.Idle,
    error: null
}

const pkiDevices = (state = devicesInitialState, action) => {
    switch (action.type) {
        case "SET_PKI_DEVICES_LOADING":
            return {
                ...devicesInitialState,
                status: Status.Loading,
            };
        case "SET_PKI_DEVICES_LOADED":
            return {
                ...devicesInitialState,
                devices: action.payload,
            };
        case "SET_PKI_DEVICES_LOAD_ERROR":
            return {
                ...devicesInitialState,
                status: Status.Error,
                error: action.payload,
            };
        default:
            return state
    }
}

const pkiAuthData = (state = { deviceId: null, certId: null }, action) => {
    switch (action.type) {
        case "SET_PKI_AUTH_DATA":
            return { ...action.payload }
        default:
            return state
    }
}

export {
    plugin,
    pkiDevices,
    pkiAuthData,
};