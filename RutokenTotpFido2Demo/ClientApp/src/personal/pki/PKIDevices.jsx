import React, { useEffect, useState } from "react";
import { BucketIcon } from "../../controls/BucketIcon";
import DeleteDeviceModal from "../DeleteDeviceModal";
import { useDispatch, useSelector } from "react-redux";
import { hideModal, showModal } from "../../redux/actionCreators";
import { deletePki, getPkiDevices } from "../../redux/actions/pkiActions";
import { Factor, Status } from "../../utils/constants";
import LoadingContent from "../../common/LoadingContent";
import { dateToLocaleWithoutTime } from "../../utils/utils";
import RenderTwoFactorInit from "../RenderTwoFactorInit";

const PKIDevices = () => {
    const dispatch = useDispatch();
    const { operationStatus, devices } = useSelector(state => state.plugin);
    const { pkiKeys } = useSelector(state => state.userInfo);
    const [addPKI, setAddPKI] = useState(false);

    useEffect(() => {
        if (devices.length === 0) dispatch(getPkiDevices());
    }, []);

    const showDeleteDeviceModal = (serial) => {
        dispatch(showModal(DeleteDeviceModal, {
            title: 'Удаление устройства Рутокен',
            body: <div className="my-3_5rem text-center">Вы уверены, что хотите удалить Рутокен устройство?</div>,
            action: deleteDevice,
            id: serial
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
                if (pkiKeys.some(pkiKey => pkiKey.serialNumber === cert.serial)) {
                    bindedDevices.push({
                        serial: device.serial,
                        name: cert.subjectProp.commonName,
                        modelName: device.modelName,
                        certSerial: cert.serial,
                        validNotAfter: cert.validNotAfter,
                    });
                }
            }
        }

        return bindedDevices;
    }

    const renderBindedDevicesWithCerts = () => {
        if (operationStatus === Status.Loading) return <LoadingContent />;
        if (operationStatus === Status.Error || devices.length === 0) return "Не удалось получить информацию о добавленных устройствах";

        const bindedDevices = getBindedDevices();

        if (bindedDevices.length === 0) return "Устройство не подключено или на нем отсутствует привязанный сертификат";

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
            <div className="mt-3 mb-2rem">
                {renderBindedDevicesWithCerts()}
            </div>

            {!addPKI && operationStatus != Status.Loading &&
                <div className="text-center mt-1_5rem">
                    <span className="modal-footer-link cursor-pointer" onClick={() => setAddPKI(true)}>Добавить Рутокен</span>
                </div>
            }

            {addPKI &&
                <RenderTwoFactorInit initialFactor={Factor.PKI} closeAddPki={() => setAddPKI(false)}></RenderTwoFactorInit>
            }
        </div>
    );
}

export default PKIDevices;
