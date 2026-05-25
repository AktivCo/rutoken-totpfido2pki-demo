import React, {useEffect, useState, useRef} from "react";
import {useDispatch} from 'react-redux';

import EditDeviceNameModal from "./EditDeviceNameModal";
import DeleteDeviceModal from "../DeleteDeviceModal";
import InitPass from "../pass/InitPass";
import InitFido from "./InitFido";

import { hideModal, showModal } from "../../redux/actionCreators";
import {deleteDeviceFido} from "../../redux/actions";
import {dateToLocale} from "../../utils/utils";
import { Factor } from "../../utils/constants";

import {BucketIcon} from "../../controls/BucketIcon"

const RenderFidoKeysList = ({keys, type}) => {
    const dispatch = useDispatch();

    const [list, setList] = useState([]);
    const [visible, setVisible] = useState(false);

    const initFidoRef = useRef(null);

    useEffect(() => {
        setList(keys);
        setVisible(false);
    }, [keys]);

    useEffect(() => {
        if (initFidoRef && initFidoRef.current)
            initFidoRef.current.scrollIntoView({behavior: 'smooth'});
    }, [visible]);

    const registerViewToggle = () => {
        setVisible(true);
    }

    const deleteDevice = (id) => {
        dispatch(showModal(DeleteDeviceModal, {
            action: deleteDeviceCredential,
            id: id
        }));
    }

    const deleteDeviceCredential = async (id) => {
        dispatch(deleteDeviceFido(id))
            .then(() => {
                const newKeys = list.filter((item) => item.id !== id);
                setList(newKeys);
                dispatch(hideModal());
            });
    }

    const renameDevice = async (id) => {
        dispatch(showModal(EditDeviceNameModal, {isCreate: false, credential: id}));
    }

    return (
        <div className="pb-4">
            <div className="personal-two-factor-heading">Добавленные устройства</div>
            {list.map((item) =>
                <div className="item-device d-flex align-items-center justify-content-between" key={item.id}>
                    <div>
                        <div className="d-flex align-items-center column-gap-2">
                            <div className="fw-600" style={{overflowWrap: "anywhere"}}>{item.label}</div>
                            <div className="edit-icon cursor-pointer align-self-start" onClick={() => renameDevice(item.id)}></div>
                        </div>
                        <div>
                            <span className="personal-expiration__text">Последняя активность: </span>
                            <span className="fw-normal">{dateToLocale(item.lastLogin)}</span>
                        </div>
                        {type == Factor.FIDO ? (
                            <div>
                                <span className="personal-expiration__text">Вход без логина и пароля: </span>
                                <span className="fw-normal">{item.isPasswordLess ? "Включен" : "Выключен"}</span>
                            </div>
                        ) : null}
                    </div>

                    <div className="bucket-block" onClick={() => deleteDevice(item.id)}>
                        <div className="bucket-icon cursor-pointer" onClick={() => deleteDevice(item.id)}>
                            <BucketIcon></BucketIcon>
                        </div>
                    </div>
                </div>
            )}
            {
                !visible &&
                <div className="d-flex flex-column align-items-center">
                    <div className="
                            modal-footer-link
                            fw-bolder
                            cursor-pointer"
                        onClick={() => registerViewToggle()}
                    >
                        Добавить Рутокен {type == Factor.FIDO ? 'MFA' : ''}
                    </div>
                </div>
            }
            {
                visible &&
                <div ref={initFidoRef}>
                    {type == Factor.FIDO ? <InitFido setVisible={setVisible}/> : null}
                    {type == Factor.PASS ? <InitPass setVisible={setVisible}/> : null}
                </div>
            }
        </div>
    );
}


export default RenderFidoKeysList;
