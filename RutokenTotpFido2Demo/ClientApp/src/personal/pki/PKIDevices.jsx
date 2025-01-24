import React, { useEffect } from "react";
import { BucketIcon } from "../../controls/BucketIcon";
import DeleteDeviceModal from "../DeleteDeviceModal";
import { useDispatch, useSelector } from "react-redux";
import { hideModal, showModal } from "../../redux/actionCreators";
import { deletePki, getPkiDevices } from "../../redux/actions/pkiActions";
import { Status } from "../../utils/constants";
import LoadingContent from "../../common/LoadingContent";
import { dateToLocaleWithoutTime } from "../../utils/utils";

const PKIDevices = () => {
    const dispatch = useDispatch();
    const { operationStatus, devices } = useSelector(state => state.plugin);
    const { pkiKeys } = useSelector(state => state.userInfo);

    useEffect(() => {
        if (devices.length === 0) dispatch(getPkiDevices());
    }, []);

    const showDeleteDeviceModal = (serial) => {
        dispatch(showModal(DeleteDeviceModal, {
            title: 'Удаление устройства Рутокен',
            body: <div className="my-3_5rem text-center">Вы уверены, что хотите удалить Рутокен устройство?</div>,
            action: deleteDevice,
            serial
        }));
    }

    const deleteDevice = (certSerial) => {
        dispatch(deletePki(certSerial))
            .then(() => dispatch(hideModal()));
    }

    const getBindedDevices = () => {
        const bindedDevices = [];
        
        for (let device of devices) {
            for (let cert of device.certs) {
                bindedDevices.push({
                    serial: device.serial,
                    name: cert.subjectProp.commonName,
                    modelName: device.modelName,
                    certSerial: cert.serial,
                    validNotAfter: cert.validNotAfter,
                });
            }
        }

        return bindedDevices;
    }

    const renderBindedDevicesWithCerts = () => {
        if (operationStatus === Status.Loading) return <LoadingContent />;
        if (operationStatus === Status.Error || devices.length === 0) return "Не удалось получить информацию о добавленных устройствах";

        const bindedDevices = getBindedDevices();

        return bindedDevices.map((device) =>
            <div className="border rounded px-1_25rem py-4" key={device.serial}>
                <div className="d-flex">
                    <div className="d-flex align-items-center gap-2 fs-1_5rem fw-600">
                        <span>{device.modelName}</span>
                        <span className="text-charcoal opacity-0_68">{device.serial}</span>
                    </div>
                    <div className="bucket-block ms-auto" onClick={() => showDeleteDeviceModal(device.certSerial)}>
                        <div className="bucket-icon cursor-pointer">
                            <BucketIcon></BucketIcon>
                        </div>
                    </div>
                </div>
                <hr className="my-0_75rem" />
                <div className="d-flex flex-column gap-0_375rem text-charcoal">
                    <span className="fw-600">{device.name}</span>
                    <div className="d-flex gap-0_375rem ">
                        <span className="opacity-0_68">Сертификат истекает</span>
                        <span>{dateToLocaleWithoutTime(device.validNotAfter)}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-2rem">
            <span className="fw-600 fs-1_75rem">Добавленные устройства</span>
            <div className="mt-3">
                {renderBindedDevicesWithCerts()}
            </div>
        </div>
    );
}

export default PKIDevices;
