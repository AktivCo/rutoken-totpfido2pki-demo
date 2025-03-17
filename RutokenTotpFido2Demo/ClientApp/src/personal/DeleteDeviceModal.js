import React from "react";
import {useDispatch} from "react-redux";

import ModalComponent from "../modal/ModalComponent";
import { hideModal } from "../redux/actionCreators";

const DeleteDeviceModal = ({action, id}) => {
    const dispatch = useDispatch();

    const close = () => {
        dispatch(hideModal());
    }

    const confirm = () => {
        action(id);
    }

    return (
        <ModalComponent
            className={'custom-modal'}
            title='Удаление Рутокена'
            onSubmit={confirm}
            submitButtonText="Удалить"
            footerLinks={[{onClick: close, label: 'Оставить'}]}
        >
            <div className="my-3_5rem text-center">Уверены, что хотите удалить устройство Рутокен?</div>
        </ModalComponent>
    )
}

export default DeleteDeviceModal;