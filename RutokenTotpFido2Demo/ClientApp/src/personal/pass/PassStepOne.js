import React from "react";
import cn from 'classnames';

import StepContainer from "../StepContainer";

import { ExternalLinks } from "../../utils/constants";
import DownloadIcon from "../../images/DownloadIcon";


const PassStepOne = ({currentStep, toNextStep}) => {
    const stepId = 1;

    const passStores = [
        {
            label: 'App Store',
            title: 'Рутокен Pass для iOS/iPadOS 18+',
            textLink: 'Скачайте по QR-коду или воспользуйтесь',
            link: ExternalLinks.PassAppStroe,
            img: 'pass_appstore_qr'
        },
        {
            label: 'RUStore',
            title: 'Рутокен Pass для Android 14+',
            textLink: 'Скачайте по QR-коду или воспользуйтесь',
            link: ExternalLinks.PassRustore,
            img: 'pass_rustore_qr'
        },
        {
            label: 'DMG Universal',
            title: 'Рутокен Pass для macOS 26+',
            text: 'Версия для macOS пока не в релизе. Актуальная ссылка появится позже.',
            download: ExternalLinks.PassDMG,
        },
    ];


    return (
        <StepContainer
            stepId={stepId}
            header={"Установите приложение Рутокен Pass и настройте окружение"}
            currentStep={currentStep}
            toNextStep={toNextStep}
        >
            <div>
                Приложение предназначено для беспарольной аутентификации по технологии Passkey
                с использованием Рутокен ЭЦП 3.0 на ресурсах с поддержкой FIDO2/WebAuthn.
            </div>

            <div className="pass-download-list my-4">
                {passStores.map((item) => (
                    <div className="w-100 pass-download-card" key={item.title}>
                        <div className={cn(
                                "d-flex flex-column",
                                item.textLink ? "justify-content-between" : "justify-content-center"
                            )}
                        >
                            <div className="d-flex flex-column justify-content-center gap-0_5rem">
                                <div className="pass-download-card__label">{item.label}</div>
                                <div className="pass-download-card__title">{item.title}</div>
                            </div>
                            {
                                item.textLink && 
                                <div className="pass-download-card__text">
                                    {item.textLink}{' '}
                                    <a href={item.link} target="_blank" rel="noreferrer" className="link-text-default">
                                        ссылкой
                                    </a>
                                </div>
                            }
                        </div>

                        {
                            item.download && 
                            <div className="pass-download-card__item">
                                <a
                                    className="pass-download-card__action gap-0_5rem"
                                    href={item.download}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <DownloadIcon/>
                                    Скачать
                                </a>
                            </div>
                        }
                        {
                            item.img &&
                            <div className="pass-download-card__item">
                                <div className={item.img}></div>
                            </div>
                        }
                    </div>
                ))}
            </div>

            <div>
                Для настройки окружения следуйте подсказкам в приложении. Подробнее в{' '}
                <a href={ExternalLinks.PassUserGuide2} target="_blank" rel="noreferrer" className="link-text-default">
                    Руководстве пользователя Рутокен Pass
                </a>
                .
            </div>
        </StepContainer>
    );
};

export default PassStepOne;