import React from "react";
import {useDispatch} from "react-redux";

import ModalComponent from "../modal/ModalComponent";
import { hideModal } from "../redux/actionCreators";

const DeleteDeviceModal = ({title, body, action, id}) => {
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
            title={title}
            onSubmit={confirm}
            submitButtonText="Подтвердить"
            footerLinks={[{onClick: close, label: 'Отменить'}]}
        >
            {body}
        </ModalComponent>
    )
}

export default DeleteDeviceModal;