import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Status } from "../../utils/constants";
import Rutoken3Image from "../../images/Rutoken3Image";
import LoadingContent from "../../common/LoadingContent";
import ErrorContent from "../../common/ErrorContent";
import { getPKIDevices } from "../../redux/actions/pkiActions";
import { setPKIAuthData } from "../../redux/actionCreators";
import PKINoDevicesFound from "./PKINoDevicesFound";

const PKISelectDevice = ({ onSelect }) => {
    const dispatch = useDispatch();
    const { devices, status } = useSelector(state => state.pkiDevices)

    useEffect(() => {
        dispatch(getPKIDevices());
    }, []);

    useEffect(() => {
        if (devices.length == 1) {
            handleSelect(devices[0].deviceId);
        };
    }, [devices])

    const handleSelect = (id) => {
        onSelect?.();
        dispatch(setPKIAuthData(id));
    }

    if (status === Status.Loading) return <LoadingContent />

    if (status === Status.Error) return <ErrorContent />

    if (devices.length === 0) return <PKINoDevicesFound />

    return (
        <div className="d-flex flex-column gap-0_75rem w-100">
            {
                devices.map(device =>
                    <div key={device.serial} className="border rounded p-3 cursor-pointer" onClick={() => handleSelect(device.deviceId)}>
                        <div className="d-flex gap-0_75rem">
                            <Rutoken3Image />
                            <div className="d-flex flex-column justify-content-center">
                                <span className="fw-600 text-charcoal">Рутокен ЭЦП</span>
                                <span className="text-charcoal opacity-0_68 fs-1rem">{device.serial}</span>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
};

export default PKISelectDevice;