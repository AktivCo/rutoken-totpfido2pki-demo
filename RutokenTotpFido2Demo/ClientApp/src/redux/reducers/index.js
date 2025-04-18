import {combineReducers} from 'redux';
import { plugin, pkiAuthData } from './pkiReducers';

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


const rootReducer = combineReducers({
    loginState,
    userInfo,
    totpParams,
    twoFactorType,
    modal,

    plugin,
    pkiAuthData,
});

export default rootReducer;