import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { dateToLocaleWithoutTime } from "../../utils/utils";
import { getPkiDevices,  } from '../../redux/actions/pkiActions'
import LoadingContent from "../../common/LoadingContent";
import { setPkiAuthData } from "../../redux/actionCreators";
import PKINoDevicesFound from "./PKINoDevicesFound";
import { Status } from "../../utils/constants";
import ErrorContent from "../../common/ErrorContent";

const PKISelectCertificate = ({ onSelect }) => {
    const dispatch = useDispatch();
    const { operationStatus, devices } = useSelector(state => state.plugin);

    useEffect(() => {
        dispatch(getPkiDevices());
    }, []);
    
    const handleSelectCert = (device, certId) => {
        dispatch(setPkiAuthData(device.deviceId, certId));
        onSelect?.(device);
    }

    const renderNoCertsFound = () => (
        <span className="fs-1rem text-charcoal opacity-0_68 text-center">Нет сертификатов</span>
    );

    const renderCerts = (device) => {
        if (device.certs.length === 0)
            return renderNoCertsFound();

        return device.certs.map((cert, idx) => (
            <div
                className="p-3 border rounded d-flex flex-column cursor-pointer gap-0_25rem"
                key={cert.certId}
                onClick={() => handleSelectCert(device, cert.certId)}
            >
                {
                    idx == 0 && !!cert.lastLoginDate &&
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

    if (operationStatus === Status.Loading)
        return <LoadingContent />

    if (operationStatus === Status.Error)
        return <ErrorContent />

    if (devices.length === 0)
        return <PKINoDevicesFound />;

    return (
        <div className="d-flex flex-column gap-4">
            {devices.map((device) => (
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