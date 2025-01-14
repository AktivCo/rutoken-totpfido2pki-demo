import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import {Input} from 'reactstrap';

import ModalComponent from "../../modal/ModalComponent";
import {confirmRegisterFido, renameDeviceFido} from "../../redux/actions";
import { hideModal } from '../../redux/actionCreators';

const EditDeviceNameModal = ({isCreate, credential, isWithoutLogin}) => {
    const dispatch = useDispatch();

    const [error, setError] = useState('');
    const [mfaName, setMfaName] = useState('');
    const handleMfaNameChange = (evt) => setMfaName(evt.target.value);

    const registerNewCredential = () => {
        dispatch(createOrUpdate())
            .then((response) => {
                dispatch(hideModal());
            })
            .catch(err => {
                setError(err.response.data.message);
            });
    }

    const createOrUpdate = () => {
        return isCreate ? confirmRegisterFido(credential, mfaName, isWithoutLogin)
                        : renameDeviceFido(credential, mfaName)
    }

    const close = () => {
        dispatch(hideModal());
    }

    const renderBody = () => {
        return (
            <div className='modal-edit d-flex flex-column align-items-stretch justify-content-center my-6rem'>
                <div className='d-flex flex-column align-items-stretch'>
                    <Input maxLength={78} className={"modal-input form-control " + (error ? 'modal-input-error' : '')} 
                        placeholder="Название" value={mfaName} onChange={handleMfaNameChange}></Input>
                    {
                        error 
                            ? <small className="modal-error-text d-block text-danger">{error}</small>
                            : <></>
                    }
                </div>
            </div>
        );
    }

    return (
        <ModalComponent
            className={'custom-modal' + (isCreate ? ' fade-modal' : '')}
            title={"Назовите Рутокен MFA"}
            {...(isCreate && {step: 3})}
            onSubmit={() => registerNewCredential()}
            submitButtonText='Готово'
            {...({footerLinks: [{onClick: () => close(), label: 'Закрыть'}]})}
        >
            {renderBody()}            
        </ModalComponent>
    )
}

export default EditDeviceNameModal;