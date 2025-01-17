import { Status } from "../../utils/constants";

const pluginInitialState = {
    instance: null,
    loadStatus: Status.Idle,
    loadError: null,
    operationStatus: Status.Idle,
    operationError: null,
    devices: [],
}

const plugin = (state = pluginInitialState, action) => {
    switch (action.type) {
        case 'SET_PLUGIN_LOAD_START':
            return {
                ...state,
                loadStatus: Status.Loading,
            };
        case 'SET_PLUGIN_LOAD_SUCCESS':
            return {
                ...state,
                loadStatus: Status.Success,
                instance: action.payload,
            };
        case 'SET_PLUGIN_LOAD_ERROR':
            return {
                ...state,
                instance: null,
                loadStatus: Status.Error,
                loadError: action.payload,
            };
        case "SET_PLUGIN_OPERATION_START":
            return {
                ...state,
                operationStatus: Status.Loading,
                operationError: null,
            };
        case "SET_PLUGIN_OPERATION_SUCCESS":
            return {
                ...state,
                operationStatus: Status.Success,
                operationError: null,
            };
        case "SET_PLUGIN_OPERATION_ERROR":
            return {
                ...state,
                operationStatus: Status.Error,
                operationError: action.payload,
            };
        case "SET_PLUGIN_DEVICES_LOAD_SUCCESS":
            return {
                ...state,
                operationStatus: Status.Success,
                devices: action.payload,
            };
        default:
            return state;
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
    pkiAuthData,
};