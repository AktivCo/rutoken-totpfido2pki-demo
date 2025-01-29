import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { dateToLocaleWithoutTime } from "../../utils/utils";
import { getPkiDevices,  } from '../../redux/actions/pkiActions'
import LoadingContent from "../../common/LoadingContent";
import { setPkiAuthData } from "../../redux/actionCreators";
import PKINoDevicesFound from "./PKINoDevicesFound";
import { Status } from "../../utils/constants";
import ErrorContent from "../../common/ErrorContent";
import { getUserInfo } from "../../redux/actions";

const PKISelectCertificate = ({ onSelect }) => {
    const dispatch = useDispatch();
    const { operationStatus, devices } = useSelector(state => state.plugin);
    const twoFactorType = useSelector(state => state.twoFactorType);
    const userInfo = useSelector(state => state.userInfo);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        dispatch(getPkiDevices());

        if (twoFactorType === "PKI") {
            setIsLoading(true);
            dispatch(getUserInfo())
                .then(() => setIsLoading(false));
        };
    }, []);
    
    const handleSelectCert = (device, certId) => {
        dispatch(setPkiAuthData(device.deviceId, certId));
        onSelect?.(device);
    }

    const renderDeviceText = (text) => (
        <span className="fs-1rem text-charcoal opacity-0_68 text-center">{text}</span>
    );

    const renderCerts = (device) => {
        if (!device.isSupported)
            return renderDeviceText("Устройство не поддерживается");

        if (device.certs.length === 0)
            return renderDeviceText("Нет сертификатов");

        return device.certs.map((cert, idx) => (
            <div
                className="p-3 border rounded d-flex flex-column cursor-pointer gap-0_25rem"
                key={cert.certId}
                onClick={() => handleSelectCert(device, cert.certId)}
            >
                {
                    idx === 0 && !!cert.lastLoginDate && twoFactorType === "PKINoLoginBefore" &&
                        <span className="text-surfie fw-bolder fs-1rem">Использовали ранее</span>
                }
                <div className="d-flex">
                    <span
                        data-tooltip-id="cert-name-tooltip"
                        data-tooltip-content={cert.subjectProp.commonName}
                        className="text-charcoal fw-600 text-truncate"
                    >
                        {cert.subjectProp.commonName}
                    </span>
                </div>
                <span className="fs-1rem">
                <span className="text-charcoal opacity-0_68">Сертификат истекает&nbsp;</span>{dateToLocaleWithoutTime(cert.validNotAfter)}</span>
            </div>
        ))
    };

    const getFilteredDevices = () => {
        if (twoFactorType === "PKINoLoginBefore") return devices;

        if (!userInfo) return [];

        for (let device of devices) {
            for (let pkiKey of userInfo.pkiKeys) {
                const found = device.certs.find(cert => cert.serial === pkiKey.serialNumber)

                if (found) {
                    return [{ ...device, certs: [found]}];
                }
            }
        }

        return [];
    }

    if (operationStatus === Status.Loading || isLoading)
        return <LoadingContent />

    if (operationStatus === Status.Error)
        return <ErrorContent />

    const filteredDevices = getFilteredDevices();

    if (filteredDevices.length === 0)
        return <PKINoDevicesFound {...(twoFactorType === "PKI" && {text: 'Не удалось найти устройство с соответствующим сертификатом'})} />;

    return (
        <div className="d-flex flex-column gap-4">
            {filteredDevices.map((device) => (
                <div key={device.serial} className="w-100">
                    <div className="d-flex justify-content-between mb-2">
                        <span className="text-charcoal fw-600">{device.modelName}</span>
                        <span className="text-charcoal opacity-0_68 fw-600">{device.serial}</span>
                    </div>
                    <div className="d-flex flex-column gap-0_75rem">
                        {renderCerts(device)}
                    </div>
                </div>
            ))}
        </div>
    )
};

export default PKISelectCertificate;