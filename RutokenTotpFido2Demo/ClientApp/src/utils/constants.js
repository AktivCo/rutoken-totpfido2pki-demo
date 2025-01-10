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
});