const SET_RUTOKEN_INFO = (param) => ({
    type: 'SET_RUTOKEN_INFO',
    payload: param
});


const setRutokenInfo = (param) => {
    return (dispatch) => {
        dispatch(SET_RUTOKEN_INFO(param));
    }
}

export {
    setRutokenInfo
};