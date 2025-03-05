import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Status } from "../../utils/constants";
import Rutoken3Image from "../../images/Rutoken3Image";
import LoadingContent from "../../common/LoadingContent";
import ErrorContent from "../../common/ErrorContent";
import { getPkiDevices } from "../../redux/actions/pkiActions";
import { setPkiAuthData } from "../../redux/actionCreators";
import PKINoDevicesFound from "./PKINoDevicesFound";
import RutokenSmartCardImage from "../../images/RutokenSmartCardImage";

const PKISelectDevice = ({ onSelect }) => {
    const dispatch = useDispatch();
    const { operationStatus, devices } = useSelector(state => state.plugin);

    useEffect(() => {
        dispatch(getPkiDevices());
    }, []);

    useEffect(() => {
        const filteredDevices = devices.filter(d => d.certs.length == 0);
        if (filteredDevices.length == 1 && filteredDevices[0].isSupported) {
            handleSelect(filteredDevices[0]);
        };
    }, [devices])

    const handleSelect = (device) => {
        dispatch(setPkiAuthData(device.deviceId));
        onSelect?.(device);
    };

    if (operationStatus === Status.Loading) return <LoadingContent />

    if (operationStatus === Status.Error) return <ErrorContent />

    if (devices.length === 0) return <PKINoDevicesFound />

    return (
        <div className="d-flex flex-column gap-0_75rem w-100">
            {
                devices.map(device => {
                    const deviceIsAvailable = device.isSupported && device.certs.length == 0;
                    return (
                        <div key={device.serial}
                            className={`border rounded p-3 ${deviceIsAvailable ? 'cursor-pointer' : 'cursor-disabled'} `}
                            onClick={() => deviceIsAvailable ? handleSelect(device) : null}>
                            <div className="d-flex gap-0_75rem">
                                {device.isSmartCard ? 
                                    <RutokenSmartCardImage /> : <Rutoken3Image />   
                                }
                                <div className="d-flex flex-column justify-content-center">
                                    <span className="fw-600 text-charcoal">{device.modelName}</span>
                                    <span className="text-charcoal opacity-0_68 fs-1rem">{device.serial}</span>
                                    {!device.isSupported &&
                                        <span className="text-orange fs-0_875rem">Не поддерживается</span>
                                    }
                                    {device.certs.length > 0 &&
                                        <span className="text-orange fs-0_875rem">Устройство добавлено</span>
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }
                )
            }
        </div>
    )
};

export default PKISelectDevice;