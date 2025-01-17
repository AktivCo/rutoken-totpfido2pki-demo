const setLoginState = (loginState) => ({
    type: 'SET_LOGIN_STATE',
    payload: loginState
});

const setUserInfo = (userInfo) => ({
    type: 'SET_USER_INFO',
    payload: userInfo
});

const setTwoFactorType = (factor) => ({
    type: 'SET_TWO_FACTOR_TYPE',
    payload: factor
});

const showModal = (modal, data) => ({
    type: 'SHOW_MODAL',
    payload: {
        modal,
        data,
    }
});

const hideModal = () => ({
    type: 'HIDE_MODAL',
    payload: null,
});

const setTotpParams = (params) => ({
    type: 'TOTP_PARAMS',
    payload: params
});

const setPluginLoadStart = () => ({
    type: 'SET_PLUGIN_LOAD_START',
    payload: null
});

const setPluginLoadSuccess = (plugin) => ({
    type: 'SET_PLUGIN_LOAD_SUCCESS',
    payload: plugin
});

const setPluginLoadError = (error) => ({
    type: 'SET_PLUGIN_LOAD_ERROR',
    payload: error
});

const setPluginOperationStart = () => ({
    type: 'SET_PLUGIN_OPERATION_START',
    payload: null
});

const setPluginOperationSuccess = () => ({
    type: 'SET_PLUGIN_OPERATION_SUCCESS',
    payload: null
});

const setPluginOperationError = (error) => ({
    type: 'SET_PLUGIN_OPERATION_ERROR',
    payload: error
});

const setPluginDevicesLoadSuccess = (devices) => ({
    type: 'SET_PLUGIN_DEVICES_LOAD_SUCCESS',
    payload: devices
});

const setPkiAuthData = (deviceId, certId = null) => ({
    type: 'SET_PKI_AUTH_DATA',
    payload: {
        deviceId,
        certId,
    }
});

export {
    setLoginState,
    setUserInfo,
    setTwoFactorType,
    showModal,
    hideModal,
    setTotpParams,
    setPluginLoadStart,
    setPluginLoadSuccess,
    setPluginLoadError,
    setPluginOperationStart,
    setPluginOperationSuccess,
    setPluginOperationError,
    setPluginDevicesLoadSuccess,
    setPkiAuthData,
}