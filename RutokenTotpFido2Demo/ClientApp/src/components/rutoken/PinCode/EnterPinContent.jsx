import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'reactstrap';

import PasswordInput from '../../../controls/PasswordInput';
import { PinCodeState } from '../EnterPinCodeModal';

import { checkOnlyDigit } from '../../../utils/utils';
import { loginByCert } from '../../../redux/actions/rutokenActions';


const EnterPinContent = ({setCurrentPinCode, changePinCodeState}) => {

    const plugin = useSelector(state => state.plugin);
    const rutokenInfo = useSelector(state => state.rutokenInfo);


    const [pinCode, setPinCode] = useState('');
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    
    const handlePinCodeChange = (e) => {
        const inputValue = e.target.value;

        if (checkOnlyDigit(inputValue)) {
            setPinCode(inputValue);
        }
    };
  
    const pinRetriesLeft = (deviceId) => {
        return plugin.instance.getDeviceInfo(deviceId, plugin.instance.TOKEN_INFO_PINS_INFO)
            .then((data) => {
                if (data.retriesLeft == 0) {
                    changePinCodeState(PinCodeState.BlockPin);
                    return;
                } 
                setError(`Неверный PIN-код. Осталось попыток: ${data.retriesLeft}`);
            });
    }

    const checkDefaultPinCode = (deviceId) => {
        return plugin.instance.getDeviceInfo(deviceId, plugin.instance.TOKEN_INFO_PINS_INFO)
            .then((pinInfo) => {
                return pinInfo?.isPinDefault;
            });
    }

    const deviceLogin = (deviceId, pinCode) => {
        return plugin.instance.login(deviceId, pinCode)
            .then((data) => {
                return 'success';
            })
            .catch((error) => {
                if (!error || !error?.code)
                    return;

                return error.code;
            });
    }

    const onSubmit = async () => {
        if (!pinCode || pinCode.trim() == '') {
            await pinRetriesLeft(rutokenInfo.deviceId);
            return;
        }

        let result = await deviceLogin(rutokenInfo.deviceId, pinCode);

        switch (result) {
            case plugin.instance?.errorCodes?.PIN_INCORRECT:
                await pinRetriesLeft(rutokenInfo.deviceId);
                break;
            case plugin.instance?.errorCodes?.PIN_LOCKED:
                changePinCodeState(PinCodeState.BlockPin);
                break;
            case 'success':            
                let isPinDefault = await checkDefaultPinCode(rutokenInfo.deviceId);
                if (isPinDefault) {
                    setCurrentPinCode(pinCode);
                    changePinCodeState(PinCodeState.ChangePin);
                } else {
                    setError(null);
                }
                //TODO: обработать тут же кейс регистрации
                dispatch(loginByCert());
                break;
            default:
                changePinCodeState(PinCodeState.DefaultError)
                break;
        }
    }
      

    return (
        <div className='d-flex flex-column mt-4 gap-3'>
            <PasswordInput
                maxLength='20'
                className='form-control pe-2_25rem' 
                placeholder='PIN-код'
                value={pinCode}
                style={{backgroundImage: 'none'}}
                invalid={!!error}
                onChange={handlePinCodeChange}
                feedback={error}
            />

            <Button
                type='submit'
                color='danger'
                className='m-0 fs-1_125rem'
                onClick={onSubmit}
                disabled={!pinCode || pinCode.trim() == ''}
            >
                Продолжить
            </Button>
        </div>
    );
}

export default EnterPinContent;