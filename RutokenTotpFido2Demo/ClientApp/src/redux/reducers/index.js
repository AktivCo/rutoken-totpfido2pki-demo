import {combineReducers} from 'redux';
import { rutokenInfo } from './rutokenReducers';

const loginState = (state = null, action) => {
    switch (action.type) {
        case "SET_LOGIN_STATE":
            return action.payload
        default:
            return state
    }
}

const userInfo = (state = null, action) => {
    switch (action.type) {
        case "SET_USER_INFO":
            return action.payload
        default:
            return state
    }
}

const totpParams = (state = {}, action) => {
    switch (action.type) {
        case "TOTP_PARAMS":
            return action.payload
        default:
            return state
    }
}

const twoFactorType = (state = null, action) => {
    switch (action.type) {
        case "SET_TWO_FACTOR_TYPE":
            return action.payload
        default:
            return state
    }
}

const modal = (state = {modal: null, data: {}}, action) => {
    if (action.type === 'SHOW_MODAL') {
        return {
            ...state,
            modal: action.payload.modal,
            data: action.payload.data,
        };
    }
    if (action.type === 'HIDE_MODAL') {
        return {modal: null, data: {}};
    }
    return state;
};

const plugin = (state = {instance: null, loadError: null}, action) => {
    switch (action.type) {
        case 'SET_PLUGIN':
            return {
                ...state,
                instance: action.payload,
                loadError: null,
            };
        case 'SET_PLUGIN_LOAD_ERROR':
            return {
                ...state,
                instance: null,
                loadError: action.payload,
            };
        default:
            return state;
    }
};

const rutokenDevices = (state = { devices: [] }, action) => {
    if (action.type === 'SET_RUTOKEN_DEVICES') {
        return {
            ...state,
            devices: action.payload
        }
    }
    return state;
};


const rootReducer = combineReducers({
    loginState,
    userInfo,
    totpParams,
    twoFactorType,
    modal,
    plugin,
    rutokenDevices,

    rutokenInfo
});

export default rootReducer;