import React from "react";
import {useDispatch} from 'react-redux';

import {hideModal, removeTotp, showModal} from "../actions";

import DeleteDeviceModal from "./DeleteDeviceModal";
import {BucketIcon} from "../controls/BucketIcon"

const TotpKeyRow = ({totpkey}) => {
    const dispatch = useDispatch();

    const deleteDevice = (id) => {
        dispatch(showModal(DeleteDeviceModal, {
            title: 'Удаление устройства OTP',
            body: <div className="my-3_5rem text-center">Вы уверены, что хотите удалить OTP устройство?</div>,
            action: removeDevice,
            id: id
        }));
    }

    const removeDevice = (totpKey) => {
        dispatch(removeTotp(totpKey))
            .then(() => dispatch(hideModal()))
    }
    
    return (
        <div className="item-device d-flex align-items-center justify-content-between">
            <div className="fw-w-600">Рутокен OTP</div>
            <div className="bucket-block" onClick={() => deleteDevice(totpkey)}>
                <div className="bucket-icon cursor-pointer">
                    <BucketIcon></BucketIcon>
                </div>
            </div>
        </div>
    );
}

const RenderTotpKeysList = ({keys}) => {

    return (
        <div className="pb-4">
            <div>
                {keys.map((el, id) => <TotpKeyRow key={id} totpkey={el}></TotpKeyRow>)}
            </div>
        </div>
    )
}

export default RenderTotpKeysList;