const rutokenInfo = (state = null, action) => {
    switch (action.type) {
        case "SET_RUTOKEN_INFO":
            return {...action.payload}
        default:
            return state
    }
}

export {
    rutokenInfo
};