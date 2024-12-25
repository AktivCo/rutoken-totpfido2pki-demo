import React, { useState} from 'react';
import { useDispatch } from 'react-redux';

import { loginWithoutTwoFactor } from '../../redux/actions';
import ModalComponent from '../../modal/ModalComponent';
import ErrorContent from '../../common/ErrorContent';

import EnterPinContent from './PinCode/EnterPinContent';
import ChangePinContent from './PinCode/ChangePinContent';
import BlockPinContent from './PinCode/BlockPinContent';


export class PinCodeState {
    static EnterPin = 1;
    static ChangePin = 2;
    static BlockPin = 3;
    static DefaultError = 4;
};


const EnterPinCodeModal = () => {

    const dispatch = useDispatch();
    
    
    const [pinCodeState, setPinCodeState] = useState(PinCodeState.EnterPin);
    const [currentPinCode, setCurrentPinCode] = useState('');

    const changePinCodeState = (state) => {
        setPinCodeState(state);
    };

    const renderBody = () => {
        switch (pinCodeState) {
            case PinCodeState.EnterPin:
                return <EnterPinContent
                            setCurrentPinCode={setCurrentPinCode}
                            changePinCodeState={changePinCodeState}/>;
            case PinCodeState.ChangePin:
                return <ChangePinContent
                            currentPinCode={currentPinCode}
                            changePinCodeState={changePinCodeState}/>;
            case PinCodeState.BlockPin:
                return <BlockPinContent/>;
            case PinCodeState.DefaultError:
                return <ErrorContent/>;
            default:
                return null
        }
    }

    const getTitle = () => {
        let defaultTitle = 'Введите PIN-код';

        if (pinCodeState === PinCodeState.ChangePin)
            return 'Измените PIN-код по умолчанию';

        return defaultTitle;
    }

    return (
        <ModalComponent
            withLabel
            className={'custom-modal'}
            title={getTitle()}
            footerLinks={[{ onClick: () => dispatch(loginWithoutTwoFactor(null)), label: 'Назад' }]}
        >
            {renderBody()}
        </ModalComponent>
    );
}

export default EnterPinCodeModal;