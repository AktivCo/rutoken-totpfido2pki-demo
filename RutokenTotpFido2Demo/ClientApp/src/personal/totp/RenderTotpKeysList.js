import React from "react";
import {useDispatch} from 'react-redux';

import {removeTotp} from "../../redux/actions";

import DeleteDeviceModal from "../DeleteDeviceModal";
import {BucketIcon} from "../../controls/BucketIcon"
import { hideModal, showModal } from "../../redux/actionCreators";

const TotpKeyRow = ({totpkey}) => {
    const dispatch = useDispatch();

    const deleteDevice = (id) => {
        dispatch(showModal(DeleteDeviceModal, {
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
            <div className="fw-600">Рутокен OTP</div>
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