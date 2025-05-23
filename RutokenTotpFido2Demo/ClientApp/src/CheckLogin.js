import React, {useEffect} from "react";
import axios from "axios";
import {useDispatch, useSelector} from 'react-redux';
import {setLoginState, checkLoginState} from './redux/actions';

import Personal from "./personal/Personal";
import Auth from "./auth/Auth";

const CheckLogin = () => {

    const loginState = useSelector(state => state.loginState);
    const dispatch = useDispatch();

    useEffect(() => {
        axios.interceptors.response.use(
            (response) =>
                response,
            (error) => {
                if (error.response.status === 403) dispatch(setLoginState(false));
                return Promise.reject(error);
            },
        );

        dispatch(checkLoginState());
    }, []);

    if (loginState == null) return null;
    if (loginState) return <Personal/>;
    return <Auth/>;


}


export default CheckLogin;