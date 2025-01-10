import React, {useState} from 'react';
import { useSelector } from 'react-redux';

import CommonButton from '../../common/CommonButton';
import PasswordInput from '../../controls/PasswordInput';
import { checkOnlyDigit } from '../../utils/utils';
import ErrorContent from '../../common/ErrorContent';

const DEFAULT_PIN_CODE = '12345678';

const PKIChangePinCode = ({ onSuccess }) => {
    const { instance: plugin } = useSelector(state => state.plugin);
    const { deviceId } = useSelector(state => state.pkiAuthData);

    const [newPin, setNewPin] = useState('');
    const [repeatPin, setRepeatPin] = useState('');
    const [errorNewPin, setErrorNewPin] = useState(null);
    const [errorRepeatPin, setErrorRepeatPin] = useState(null);
    const [isUnknownError, setIsUnknownError] = useState(null);
    
    const handlePinChange = (e, setCallback, validateCallback) => {
        const value = e.target.value;

        if (checkOnlyDigit(value)) {
            setCallback(value);
            validateCallback(value);
        }
    }

    const validateNewPin = (value) => {
        setErrorNewPin(() => {
            if (value.length < 6)
                return 'PIN‑код должен содержать 6 и более символов';
    
            if (value == DEFAULT_PIN_CODE)
                return 'Новый PIN-код совпадает с PIN-кодом по умолчанию';

            return null;
        });

        setErrorRepeatPin(() => {
            if (repeatPin != value)
                return 'PIN‑коды не совпадают';
    
            return null;
        });
    }

    const validateRepeatPin = (value) => {
        setErrorRepeatPin(() => {
            if (value != newPin)
                return 'PIN‑коды не совпадают';
    
            return null;
        });
    }

    const onSubmit = () => {
        plugin.changePin(deviceId, DEFAULT_PIN_CODE, newPin, {})
            .then(() => {
                onSuccess?.();
            })
            .catch(() => {
                setIsUnknownError(true);
            });
    }

    if (isUnknownError) return <ErrorContent />

    return (
        <div className='d-flex flex-column gap-0_25rem'>
            <PasswordInput
                maxLength='10'
                className='form-control pe-2_25rem w-100' 
                placeholder='PIN-код'
                value={newPin}
                style={{backgroundImage: 'none'}}
                invalid={!!newPin && !!errorNewPin}
                onChange={e => handlePinChange(e, setNewPin, validateNewPin)}
                feedback={errorNewPin}
            />
            <PasswordInput
                maxLength='10'
                className='form-control pe-2_25rem w-100' 
                placeholder='Повторите PIN-код'
                value={repeatPin}
                style={{backgroundImage: 'none'}}
                invalid={!!repeatPin && !!errorRepeatPin}
                onChange={e => handlePinChange(e, setRepeatPin, validateRepeatPin)}
                feedback={errorRepeatPin}
            />
            <CommonButton
                onClick={onSubmit}
                disabled={!newPin || !repeatPin || !!errorNewPin || !!errorRepeatPin}
                fullWidth
                className='mt-3'
            >
                Продолжить
            </CommonButton>
        </div>
    );
}

export default PKIChangePinCode;