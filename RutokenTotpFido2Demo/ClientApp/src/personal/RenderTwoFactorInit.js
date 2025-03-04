import React, { useState } from "react";
import { Factor } from "../utils/constants";
import InitFido from "./fido/InitFido";
import InitTotp from "./totp/InitTotp";
import PKIBindInit from "./pki/PKIBindInit";

const RenderTwoFactorInit = ({ initialFactor = null, closeAddPki = null }) => {
    const [selectedFactor, setSelectedFactor] = useState(initialFactor);

    const renderFactorBlock = (factor) => {
        return (
            <div
                key={factor}
                className="personal-two-factor-block cursor-pointer"
                onClick={() => setSelectedFactor(factor)}
            >
                {factor}
                {factor == selectedFactor && <span className="personal-two-factor-block--done" />}
            </div>
        )
    }

    return (
        <>
            <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="personal-two-factor-heading">Добавить второй фактор защиты</div>
                {
                    selectedFactor && (
                        <div className="personal-logout personal-logout__text"
                            onClick={() => { setSelectedFactor(null); closeAddPki?.() }}
                        >
                            Отменить
                        </div>
                    )
                }
            </div>

            {!initialFactor &&
                <div className="personal-two-factor-blocks">
                    {Object.values(Factor).map(factor => renderFactorBlock(factor))}
                </div>
            }

            <RenderDeviceInit factor={selectedFactor}></RenderDeviceInit>
        </>
    );
}

const RenderDeviceInit = ({ factor }) => {
    if (factor === Factor.FIDO) return <InitFido />;
    if (factor === Factor.TOTP) return <InitTotp />;
    if (factor === Factor.PKI) return <PKIBindInit />;
    return null;
};

export default RenderTwoFactorInit;