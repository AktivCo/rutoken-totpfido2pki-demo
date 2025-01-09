function knownDeviceModels(plugin) {
    var knownDevices = [];

    function RutokenModel() {
        this.mechanisms = undefined;
        this.features = undefined;
        this.speed = undefined;
        this.name = undefined;
    }

    RutokenModel.prototype.has = function(mechanisms, features, speed) {
        function findSecondArrayInFirst(firts, second) {
            for (var key in second) {
                if (firts.indexOf(second[key]) == -1) return false;
            }
            return true;
        }

        for (var mechType in this.mechanisms) {
            for (var implType in this.mechanisms[mechType]) {
                if (!findSecondArrayInFirst(mechanisms[mechType][implType], this.mechanisms[mechType][implType]))
                    return false;
            }
        }

        for (var featureName in this.features) {
            if(!this.features.hasOwnProperty(featureName))
                return false;

            if (features[featureName] != this.features[featureName])
                return false;
        }

        if (this.speed != undefined && this.speed != speed) {
            return false;
        }
        return true;
    }

    var mechsSignGost2012 = [plugin.PUBLIC_KEY_ALGORITHM_GOST3410_2012_256, plugin.PUBLIC_KEY_ALGORITHM_GOST3410_2012_512];
    var mechsSignGost2001 = [plugin.PUBLIC_KEY_ALGORITHM_GOST3410_2001];
    var mechsSignRsa = [plugin.PUBLIC_KEY_ALGORITHM_RSA_512, plugin.PUBLIC_KEY_ALGORITHM_RSA_768, plugin.PUBLIC_KEY_ALGORITHM_RSA_1024,
        plugin.PUBLIC_KEY_ALGORITHM_RSA_1280, plugin.PUBLIC_KEY_ALGORITHM_RSA_1536, plugin.PUBLIC_KEY_ALGORITHM_RSA_1792, plugin.PUBLIC_KEY_ALGORITHM_RSA_2048];
    var mechsSignRsa4096 = [plugin.PUBLIC_KEY_ALGORITHM_RSA_4096];

    var mechsHash94 = [plugin.HASH_TYPE_GOST3411_94];
    var mechsHash2012 = [plugin.HASH_TYPE_GOST3411_12_256, plugin.HASH_TYPE_GOST3411_12_512];

    var mechGostCipher = [plugin.CIPHER_ALGORITHM_GOST28147];

    var ecp3_0Mechanisms = {
            "sign": {
                "hardware": [].concat(mechsSignGost2001).concat(mechsSignGost2012).concat(mechsSignRsa).concat(mechsSignRsa4096)
            },

            "hash": {
                "hardware": [].concat(mechsHash94).concat(mechsHash2012)
            }

        };

    var ecp2_0Mechanisms = {
            "sign": {
                "hardware": [].concat(mechsSignGost2001).concat(mechsSignGost2012).concat(mechsSignRsa)
            },

            "hash": {
                "hardware": [].concat(mechsHash94).concat(mechsHash2012)
            }

        };

    var ecpMechanisms = {
            "sign": {
                "hardware": [].concat(mechsSignGost2001).concat(mechsSignRsa)
            },

            "hash": {
                "hardware": [].concat(mechsHash94)
            },

            "cipher": {
                "hardware": [].concat(mechGostCipher)
            }
        };


    var RutokenEcp3_0 = function() {
        this.mechanisms = ecp3_0Mechanisms;

        this.features = {
            "journal": true,
            "customPin": true,
            "externalAuth": false
        };

        this.name = "Рутокен ЭЦП 3.0";
    }
    RutokenEcp3_0.prototype = new RutokenModel();
    knownDevices.push(new RutokenEcp3_0());

    var RutokenEcp2_0 = function() {
        this.mechanisms = ecp2_0Mechanisms;

        this.features = {
            "journal": true
        };

        this.speed = 3;

        this.name = "Рутокен ЭЦП 2.0";
    }
    RutokenEcp2_0.prototype = new RutokenModel();
    knownDevices.push(new RutokenEcp2_0());

    var RutokenEcpFlash2_0 = function() {
        this.mechanisms = ecp2_0Mechanisms;

        this.features = {
            "journal": true,
            "flashDrive": true
        };

        this.name = "Рутокен ЭЦП 2.0 Flash"
    }
    RutokenEcpFlash2_0.prototype = new RutokenModel();
    knownDevices.push(new RutokenEcpFlash2_0());

    var RutokenEcpTouch2_0 = function() {
        this.mechanisms = ecp2_0Mechanisms;

        this.features = {
            "journal": true,
            "confirmation": true,
            "visualization": false
        };

        this.name = "Рутокен ЭЦП 2.0"
    }
    RutokenEcpTouch2_0.prototype = new RutokenModel();
    knownDevices.push(new RutokenEcpTouch2_0());

    var RutokenEcpFlashTouch2_0 = function() {
        this.mechanisms = ecp2_0Mechanisms;

        this.features = {
            "journal": true,
            "confirmation": true,
            "flashDrive": true,
            "visualization": false
        };

        this.name = "Рутокен ЭЦП 2.0 Flash"
    }
    RutokenEcpFlashTouch2_0.prototype = new RutokenModel();
    knownDevices.push(new RutokenEcpFlashTouch2_0());

    var RutokenEcpPki2_0 = function() {
        this.mechanisms = ecp2_0Mechanisms;

        this.features = {
            "journal": true
        };

        this.speed = 1;

        this.name = "Рутокен ЭЦП 2.0"
    }
    RutokenEcpPki2_0.prototype = new RutokenModel();
    knownDevices.push(new RutokenEcpPki2_0());

    var RutokenEcp2151 = function() {
        this.mechanisms = ecp2_0Mechanisms;

        this.features = {
            "journal": true,
            "bio": 1
        };

        this.name = "Рутокен 2151"
    }
    RutokenEcp2151.prototype = new RutokenModel();
    knownDevices.push(new RutokenEcp2151());

    var RutokenEcp2_0Bluetooth = function() {
        this.mechanisms = ecp2_0Mechanisms;

        this.features = {
            "sm": true
        };

        this.name = "Рутокен Bluethooth"
    }
    RutokenEcp2_0Bluetooth.prototype = new RutokenModel();
    knownDevices.push(new RutokenEcp2_0Bluetooth());

    var RutokenPinpad2_0 = function() {
        this.mechanisms = ecp2_0Mechanisms;

        this.features = {
            "journal": true,
            "pin2": true,
            "confirmation": true,
            "visualization": true
        };

        this.name = "Рутокен PINPad"
    }
    RutokenPinpad2_0.prototype = new RutokenModel();
    knownDevices.push(new RutokenPinpad2_0());

    var RutokenEcp = function() {
        this.mechanisms = ecpMechanisms;

        this.speed = 3;

        this.name = "Рутокен ЭЦП"
    }
    RutokenEcp.prototype = new RutokenModel();
    knownDevices.push(new RutokenEcp());

    var RutokenEcpBluetooth = function() {
        this.mechanisms = ecpMechanisms;

        this.features = {
            "sm": true
        };

        this.name = "Рутокен Bluethooth"
    }
    RutokenEcpBluetooth.prototype = new RutokenModel();
    knownDevices.push(new RutokenEcpBluetooth());

    var RutokenEcpPki = function() {
        this.mechanisms = ecpMechanisms;

        this.speed = 1;

        this.name = "Рутокен PKI"
    }
    RutokenEcpPki.prototype = new RutokenModel();
    knownDevices.push(new RutokenEcpPki());

    var RutokenEcpFlash = function() {
        this.mechanisms = ecpMechanisms;

        this.features = {
            "flashDrive": true
        };

        this.name = "Рутокен ЭЦП Flash"
    }
    RutokenEcpFlash.prototype = new RutokenModel();
    knownDevices.push(new RutokenEcpFlash());

    var RutokenLite = function() {
        this.mechanisms = {
                "sign": {
                    "hardware": []
                },

                "hash": {
                    "hardware": []
                },

                "cipher": {
                    "hardware": []
                }
        };

        this.name = "Рутокен Lite"
    }
    RutokenLite.prototype = new RutokenModel();
    knownDevices.push(new RutokenLite());

    return knownDevices;
}

export function getRutokenModelName(device, plugin) {
    var knownModels = knownDeviceModels(plugin);

    for (var i in knownModels)
        if (knownModels[i].has(device.mechanisms, device.features, device.speed))
            return knownModels[i].name;

    return "Неизвестная модель";
}