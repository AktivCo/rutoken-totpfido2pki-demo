export const Status = Object.freeze({
    Idle: 0,
    Loading: 1,
    Error: 2,
    Success: 3,
});

export const Factor = Object.freeze({
    FIDO:   'MFA',
    TOTP:   'OTP',
    PKI:    'ЭЦП',
    PASS:   'Pass',
});

export const ExternalLinks = Object.freeze({
    RutokenUserGuide: 'https://dev.rutoken.ru/pages/viewpage.action?pageId=150241345',
    PassUserGuide1: 'https://dev.rutoken.ru/pages/viewpage.action?pageId=220135504',
    PassUserGuide2: 'https://dev.rutoken.ru/pages/viewpage.action?pageId=220135502',
    DemoPortal: 'https://demo.rutoken.ru/',
    SourceCode: 'https://github.com/AktivCo/rutoken-totpfido2pki-demo',
    PassAppStroe: 'https://apps.apple.com/app/rutoken-pass/id6504444445',
    PassRustore: 'https://www.rustore.ru/catalog/app/ru.rutoken.pass',
    PassDMG: 'https://www.rutoken.ru/support/download/pass/',

});

export const OperationErrorType = Object.freeze({
    InvalidCertDate: 0
});

export const Breakpoints = Object.freeze({
    Mobile: 720,
});
