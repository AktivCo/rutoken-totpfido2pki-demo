import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'reactstrap';

import PasswordInput from '../../../controls/PasswordInput';
import { PinCodeState } from '../EnterPinCodeModal';

import { checkOnlyDigit } from '../../../utils/utils';


const ChangePinContent = ({currentPinCode, changePinCodeState}) => {

    const plugin = useSelector(state => state.plugin);
    const rutokenInfo = useSelector(state => state.rutokenInfo);


    const [newPin, setNewPin] = useState('');
    const [repeatPin, setRepeatPin] = useState('');
    const [errorNewPin, setErrorNewPin] = useState(null);
    const [errorRepeatPin, setErrorRepeatPin] = useState(null);
    

    const handleNewPinChange = (e) => {
        const value = e.target.value;

        if (checkOnlyDigit(value)) {
            setNewPin(value);
            errorForNewPin(value);
        }
    }
    const handleRepeatPinChange = (e) => {
        const value = e.target.value;

        if (checkOnlyDigit(value)) {
            setRepeatPin(value);
            errorForRepeatPin(value);
        }
    }

    const errorForNewPin = (value) => {
        let isRepeatPinError = false;
        let isNewPinError = false;

        if ((value || repeatPin) && value != repeatPin) {
            setErrorRepeatPin('PIN‑коды не совпадают');
            isRepeatPinError = true;
        }
        if (value.length < 6) {
            setErrorNewPin('PIN‑код должен содержать 6 и более символов');
            isNewPinError = true;
        }
        if (value == currentPinCode) {
            setErrorNewPin('Новый PIN-код совпадает с PIN-кодом по умолчанию');
            isNewPinError = true;
        }

        if (!isNewPinError) setErrorNewPin(null);
        if (!isRepeatPinError) setErrorRepeatPin(null);
    }

    const errorForRepeatPin = (value) => {
        if ((value || newPin) && value != newPin) {
            setErrorRepeatPin('PIN‑коды не совпадают');
        } else {
            setErrorRepeatPin(null);
        }
    }


    const onSubmit = () => {
        plugin.instance.changePin(rutokenInfo.deviceId, currentPinCode, newPin, {})
            .then((data) => {
                //TODO: Тут код при успешой смени PIN кода (Должна быть авторизация/регистрация)
                //params: deviceId, certId
            })
            .catch((error) => {
                changePinCodeState(PinCodeState.DefaultError);
            });
    }


    return (
        <div className='d-flex flex-column mt-4 gap-3'>
            <PasswordInput
                maxLength='10'
                className='form-control pe-2_25rem w-100' 
                placeholder='PIN-код'
                value={newPin}
                style={{backgroundImage: 'none'}}
                invalid={!!errorNewPin}
                onChange={handleNewPinChange}
                feedback={errorNewPin}
            />

            <PasswordInput
                maxLength='10'
                className='form-control pe-2_25rem w-100' 
                placeholder='Повторите PIN-код'
                value={repeatPin}
                style={{backgroundImage: 'none'}}
                invalid={!!errorRepeatPin}
                onChange={handleRepeatPinChange}
                feedback={errorRepeatPin}
            />

            <Button
                type='submit'
                color='danger'
                className='m-0 fs-1_125rem'
                onClick={onSubmit}
                disabled={!!errorNewPin || !!errorRepeatPin}
            >
                Продолжить
            </Button>
        </div>
    );
}

export default ChangePinContent;