import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Status } from "../../utils/constants";
import Rutoken3Image from "../../images/Rutoken3Image";
import LoadingContent from "../../common/LoadingContent";
import ErrorContent from "../../common/ErrorContent";
import { getPkiDevices } from "../../redux/actions/pkiActions";
import { setPkiAuthData } from "../../redux/actionCreators";
import PKINoDevicesFound from "./PKINoDevicesFound";

const PKISelectDevice = ({ onSelect }) => {
    const dispatch = useDispatch();
    const { operationStatus, devices } = useSelector(state => state.plugin);

    useEffect(() => {
        dispatch(getPkiDevices());
    }, []);

    useEffect(() => {
        if (devices.length == 1) {
            handleSelect(devices[0]);
        };
    }, [devices])

    const handleSelect = (device) => {
        dispatch(setPkiAuthData(device.deviceId));
        onSelect?.(device);
    };

    const filteredDevices = devices.filter(d => d.certs.length == 0);

    if (operationStatus === Status.Loading) return <LoadingContent />

    if (operationStatus === Status.Error) return <ErrorContent />

    if (filteredDevices.length === 0) return <PKINoDevicesFound />

    return (
        <div className="d-flex flex-column gap-0_75rem w-100">
            {
                filteredDevices.map(device =>
                    <div key={device.serial}
                        className={`border rounded p-3 ${device.isSupported ? 'cursor-pointer' : 'cursor-disabled'} `} 
                        onClick={() => device.isSupported ? handleSelect(device) : null}>
                        <div className="d-flex gap-0_75rem">
                            <Rutoken3Image />
                            <div className="d-flex flex-column justify-content-center">
                                <span className="fw-600 text-charcoal">{device.modelName}</span>
                                <span className="text-charcoal opacity-0_68 fs-1rem">{device.serial}</span>
                                {!device.isSupported &&
                                    <span className="text-orange fs-0_875rem">Не поддерживается</span>
                                }
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
};

export default PKISelectDevice;