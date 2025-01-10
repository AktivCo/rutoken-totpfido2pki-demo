import React, { useEffect, useState } from "react";
import { BucketIcon } from "../../controls/BucketIcon";
import DeleteDeviceModal from "../DeleteDeviceModal";
import { useDispatch } from "react-redux";
import { hideModal, showModal } from "../../redux/actionCreators";

const PKIDevices = ({ keys }) => {
    const dispatch = useDispatch();

    const [devices, setDevices] = useState([]);

    useEffect(() => {
        getDevicesByKeys();
    }, []);

    const getDevicesByKeys = () => {
        //TODO получение устройств с сертификатами
        setDevices([
            {
                name: 'Рутокен ЭЦП 3.0',
                serial: '88005553535',
                certificate: {
                    name: 'miivanovr',
                    dateEnd: '07.03.2024'
                }
            }
        ]);
    }

    const showDeleteDeviceModal = (id) => {
        dispatch(showModal(DeleteDeviceModal, {
            title: 'Удаление устройства Рутокен',
            body: <div className="my-3_5rem text-center">Вы уверены, что хотите удалить Рутокен устройство?</div>,
            action: deleteDevice,
            id: id
        }));
    }

    const deleteDevice = (id) => {
        //TODO логика для удаления устройства
        dispatch(hideModal());
    }

    return (
        <div className="mt-2rem">
            <span className="fw-600 fs-1_75rem">Добавленные устройства</span>
            <div className="mt-3">
                {
                    devices.map((device) =>
                        <div className="border rounded px-1_25rem py-4" key={device.serial}>
                            <div className="d-flex">
                                <div className="d-flex align-items-center gap-2 fs-1_5rem fw-600">
                                    <span>{device.name}</span>
                                    <span className="text-charcoal opacity-0_68">{device.serial}</span>
                                </div>
                                <div className="bucket-block ms-auto" onClick={() => showDeleteDeviceModal(device)}>
                                    <div className="bucket-icon cursor-pointer">
                                        <BucketIcon></BucketIcon>
                                    </div>
                                </div>
                            </div>
                            <hr className="my-0_75rem" />
                            <div className="d-flex flex-column gap-0_375rem text-charcoal">
                                <span className="fw-600">{device.certificate.name}</span>
                                <div className="d-flex gap-0_375rem ">
                                    <span className="opacity-0_68">Сертификат истекает</span>
                                    <span>{device.certificate.dateEnd}</span>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default PKIDevices;
