import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import FidoLoadingContent from "../../components/fido/FidoLoadingContent";
import NoDevicesFoundSvg from "../../images/NoDevicesFoundSvg";

import { dateToLocaleWithoutTime } from "../../utils/utils";
import { getRutokenDevices } from "../../redux/actions";
import { setRutokenInfo } from '../../redux/actions/rutokenActions'

const SelectCertificateRutoken = () => {

    const dispatch = useDispatch();

    const { devices } = useSelector(x => x.rutokenDevices);


    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        dispatch(getRutokenDevices())
            .finally(() => setLoading(false));
    }, []);

    const onSelectCert = (deviceId, certId) => {
        let obj = {
            deviceId,
            certId
        };
        dispatch(setRutokenInfo(obj));
    }


    const noDevicesFound = () => (
        <div className="d-flex flex-column justify-content-center align-items-center pt-5_75rem px-1_5rem pb-6_125rem">
            <NoDevicesFoundSvg />
            <div className="text-charcoal opacity-0_68 mt-1_5rem">Нет подключенных устройств</div>
            <a href="https://dev.rutoken.ru/display/KB/RU1045" className="text-surfie text-decoration-none mt-0_75rem cursor-pointer">Почему Рутокен не видно?</a>
        </div>
    );

    const noCertsFound = () => (
        <span className="fs-1rem text-charcoal opacity-0_68 text-center">Нет сертификатов</span>
    );

    const renderCerts = (deviceId, certs) => (
        certs.length === 0 ?
            noCertsFound() :
            certs.map(cert => (
                <div className="item-cert d-flex flex-column cursor-pointer gap-0_25rem" key={cert.certId} onClick={() => onSelectCert(deviceId, cert.certId)}>
                    <span className="text-surfie fw-bolder fs-1rem">Использовали ранее</span>
                    <span className="text-charcoal fw-w-600">{cert.subjectProp.commonName}</span>
                    <span className="fs-1rem">
                        <span className="text-charcoal opacity-0_68">Сертификат истекает&nbsp;</span>{dateToLocaleWithoutTime(cert.validNotAfter)}</span>
                </div>
            ))

    );

    if (loading)
        return <FidoLoadingContent />

    if (devices.length === 0)
        return noDevicesFound();

    return (
        <div className="d-flex flex-column mb-2_8125rem w-100">
            {devices.map((device) => (
                <div key={device.serial} className="w-100">
                    <div className="d-flex justify-content-between mb-2 mt-4">
                        <span className="text-charcoal fw-w-600">{device.label}</span>
                        <span className="text-charcoal opacity-0_68 fw-w-600">{device.serial}</span>
                    </div>
                    <div className="d-flex flex-column gap-0_75rem">
                        {renderCerts(device.deviceId, device.certificates)}
                    </div>
                </div>
            ))}
        </div>
    )

};

export default SelectCertificateRutoken;