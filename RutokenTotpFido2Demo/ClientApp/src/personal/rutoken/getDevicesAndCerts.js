export default (deviceId, plugin) => {
    const pluginCertCategories = [
        plugin.CERT_CATEGORY_USER
    ];

    return Promise
        .all(pluginCertCategories.map(category => plugin.enumerateCertificates(deviceId, category)))
        .then((certs) => {
            let certificateIds = [].concat([], ...certs);
            let certificates =
                certificateIds.map((certId) =>
                    plugin
                        .parseCertificate(deviceId, certId)
                        .then((certificate) => (
                            {
                                ...certificate,
                                certId: certId,
                                issuerProp: Object.assign({}, ...certificate.issuer.map(is => ({ [is.rdn]: is.value }))),
                                subjectProp: Object.assign({}, ...certificate.subject.map(is => ({ [is.rdn]: is.value })))
                            }
                        ))
                )

            return Promise.all(certificates);

        })
        .then((certs) => {

            let certificates =
                certs.map((cert) =>
                    plugin
                        .getCertificate(deviceId, cert.certId)
                        .then((certAsBase64) => {
                            cert.certAsBase64 = certAsBase64;
                            return cert;
                        })
                )

            return Promise.all(certificates);
        })
        .then((certs) => {
            return getDeviceInfo(deviceId, plugin).then(device => {
                device.certificates = certs;
                return device;
            });
        });
}

const getDeviceInfo = (deviceId, plugin) => {
    const tokenInfoRequestTypes = [
        plugin.TOKEN_INFO_MODEL,
        plugin.TOKEN_INFO_LABEL,
        plugin.TOKEN_INFO_SERIAL,
        plugin.TOKEN_INFO_PINS_INFO,
        plugin.TOKEN_INFO_DEVICE_TYPE,
        plugin.TOKEN_INFO_SUPPORTED_MECHANISMS,
    ];

    return Promise
        .all(
            tokenInfoRequestTypes.map(requestType => plugin.getDeviceInfo(deviceId, requestType)))
        .then((values) => ({
            deviceId: deviceId,
            model: values[0],
            label: values[1],
            serial: values[2],
            isPinCached: values[3].isPinCached,
            pinRetriesLeft: values[3].retriesLeft
        }));
}
