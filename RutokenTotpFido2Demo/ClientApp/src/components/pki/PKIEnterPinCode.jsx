import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import CommonButton from '../../common/CommonButton';
import PasswordInput from '../../controls/PasswordInput';
import PKIPinCodeBlocked from './PKIPinCodeBlocked';
import ErrorContent from '../../common/ErrorContent';

const PKIEnterPinCode = ({ onSuccess }) => {
    const { instance: plugin } = useSelector(state => state.plugin);
    const { deviceId } = useSelector(state => state.pkiAuthData);

    const [pinCode, setPinCode] = useState('');
    const [isUnknownError, setIsUnknownError] = useState(null);
    const [isBlocked, setIsBlocked] = useState(false);
    const [retriesLeft, setRetriesLeft] = useState(null);

    const handlePinCodeChange = (e) => {
        const inputValue = e.target.value;

        setPinCode(inputValue);
    };

    const getPinRetriesLeft = () => {
        return plugin.getDeviceInfo(deviceId, plugin.TOKEN_INFO_PINS_INFO)
            .then(({ retriesLeft }) => {
                if (retriesLeft === 0) {
                    setIsBlocked(true);
                }
                setRetriesLeft(retriesLeft);
            });
    }

    const handleSuccessLogin = () => {
        plugin.getDeviceInfo(deviceId, plugin.TOKEN_INFO_PINS_INFO)
            .then(({ isPinDefault }) => {
                onSuccess?.(isPinDefault);
            });
    }

    const handleErrorLogin = (error) => {
        switch (error.code) {
            case plugin?.errorCodes?.ALREADY_LOGGED_IN:
                handleSuccessLogin();
                break;
            case plugin?.errorCodes?.PIN_INCORRECT:
                getPinRetriesLeft();
                break;
            case plugin?.errorCodes?.PIN_LOCKED:
                setIsBlocked(true);
                break;
            default:
                setIsUnknownError(true);
        }
    } 

    const onSubmit = () => {
        return plugin.login(deviceId, pinCode)
            .then(handleSuccessLogin)
            .catch(handleErrorLogin);
    }

    if (isBlocked) return <PKIPinCodeBlocked />

    if (isUnknownError) return <ErrorContent />

    return (
        <div className='d-flex flex-column gap-3'>
            <PasswordInput
                maxLength='32'
                className='form-control pe-2_25rem'
                placeholder='PIN-код'
                value={pinCode}
                style={{ backgroundImage: 'none' }}
                invalid={!!retriesLeft}
                onChange={handlePinCodeChange}
                feedback={`Неверный PIN-код. Осталось попыток: ${retriesLeft}`}
            />
            <CommonButton
                onClick={onSubmit}
                disabled={!pinCode || pinCode.trim() === ''}
                fullWidth
            >
                Продолжить
            </CommonButton>
        </div>
    );
}

export default PKIEnterPinCode;