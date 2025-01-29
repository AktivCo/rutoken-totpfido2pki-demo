const getPluginDownloadLink = (os) => {
    let href = '';

    switch (os) {
        case "Windows":
            href = 'https://download.rutoken.ru/Rutoken_Plugin/Current/Windows/RutokenPlugin.msi'
            break;
        case "macOS":
            href = 'https://download.rutoken.ru/Rutoken_Plugin/Current/macOS/RutokenPlugin.pkg'
            break;
        default:
            href = 'https://www.rutoken.ru/support/download/rutoken-plugin/';
            break;
    }

    return href;
}

const getExtensionDownloadLink = (browserName) => {
    switch (browserName) {
        case "Chrome":
        case "Chromium":
        case "Vivaldi":
        case "SputnikBrowser":
        case "Yandex Browser":
            return "https://chrome.google.com/webstore/detail/адаптер-рутокен-плагин/ohedcglhbbfdgaogjhcclacoccbagkjg";

        case "Firefox":
            return "https://addons.mozilla.org/ru/firefox/addon/adapter-rutoken-plugin/";

        case "Opera":
            return "https://addons.opera.com/ru/extensions/details/adapter-rutoken-plagin/";

        case "Microsoft Edge":
            return "https://microsoftedge.microsoft.com/addons/detail/rutoken-plugin-for-edge/bbkhpnmiijkcilgdnlaojbkokdhiijfc?hl=ru";
        default:
            return "http://www.rutoken.ru/support/download/rutoken-plugin/"
    }
}


export { getExtensionDownloadLink, getPluginDownloadLink };
