import React from "react";
import NoDevicesFoundSvg from "../../images/NoDevicesFoundSvg";

const PKINoDevicesFound = () => {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center pt-5_75rem px-4 pb-6_125rem">
            <NoDevicesFoundSvg />
            <div className="text-charcoal opacity-0_68 mt-1_5rem">Нет подключенных устройств</div>
            <a href="https://dev.rutoken.ru/display/KB/RU1045" className="text-surfie text-decoration-none mt-0_75rem cursor-pointer">Почему Рутокен не видно?</a>
        </div>
    );
}

export default PKINoDevicesFound;