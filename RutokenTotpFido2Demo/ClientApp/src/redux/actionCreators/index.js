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

const setPluginLoaded = (plugin) => ({
    type: 'SET_PLUGIN_LOADED',
    payload: plugin
});

const setPluginLoading = () => ({
    type: 'SET_PLUGIN_LOADING',
    payload: null
});

const setPluginLoadError = (error) => ({
    type: 'SET_PLUGIN_LOAD_ERROR',
    payload: error
});

const setPKIDevicesLoaded = (devices) => ({
    type: 'SET_PKI_DEVICES_LOADED',
    payload: devices
});

const setPKIDevicesLoading = () => ({
    type: 'SET_PKI_DEVICES_LOADING',
    payload: null
});

const setPKIDevicesLoadError = (error) => ({
    type: 'SET_PKI_DEVICES_LOAD_ERROR',
    payload: error
});

const setPKIAuthData = (deviceId, certId = null) => ({
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
    setPluginLoaded,
    setPluginLoading,
    setPluginLoadError,
    setPKIDevicesLoaded,
    setPKIDevicesLoading,
    setPKIDevicesLoadError,
    setPKIAuthData,
}