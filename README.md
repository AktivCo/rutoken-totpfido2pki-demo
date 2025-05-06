# Рутокен 2FA Демо

## Описание демо стенда

Продукт Рутокен 2FA Демо предназначен для демонстрации применения и функциональных возможностей устройств Рутокен MFA, Рутокен OTP и Рутокен ЭЦП 3.0 в сценариях двухэтапной и беспарольной аутентификации.

Для демонстрации возможностей аутентификации с помощью Рутокен MFA и Рутокен ОТР используются соответственно технологии FIDO2 (CTAP2 + WebAuthn), OATH TOTP (Time-based One-Time Password Algorithm, RFC 6238). Для демонстрации возможностей аутентификации с помощью Рутокен ЭЦП 3.0 используются два компонента:

- Рутокен Плагин - компонент браузера, позволяющий управлять ключами и сертификатами на токене и применять Рутокен ЭЦП 3.0 в инфраструктуре PKI, построенной на основе X509-сертификатов в соответствии со стандартами PKCS#7 и PKCS#10;
- Модуль сертификации - компонент, выполняющий функцию по выпуску пользовательских сертификатов на сервере аутентификации.

В системе реализована следующая функциональность:

- регистрация пользователей;
- традиционная (однофакторная) аутентификация (логин и пароль);   
- личный кабинет пользователя;
- добавление/удаление второго фактора аутентификации;
- двухэтапная и беспарольная аутентификация.


## Стек технологий

| <!-- -->            | <!-- -->              | 
| ---                 | ---                   | 
| Веб-сервер          | [.NET SDK 6](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)           |
| Среда исполнения JS | Node.js v18.0.0       |
| Фронтенд            | React                 |
| База данных         | PostgreSQL            |
| Библиотеки          | [Passwordless - FIDO2 for .NET](https://github.com/passwordless-lib/fido2-net-lib)<br> [OTP .NET](https://github.com/kspearrin/Otp.NET)<br> [QrCoder](https://github.com/codebude/QRCoder)<br> [Bouncy Castle Cryptography Library For .NET](https://github.com/bcgit/bc-csharp)   |


## Аутентификация с использованием ЭЦП

В продукте реализована двухфакторная аутентификация с использованием механизма электронной цифровой подписи.

Добавление второго фактора аутентификации

![Добавление второго фактора аутентификации](/images/pki-register.png?raw=true "Добавление второго фактора аутентификации")

Аутентификация Пользователя

![Аутентификация Пользователя](/images/pki-login.png?raw=true "Аутентификация Пользователя")

Для выпуска сертификатов пользователей требуется развернуть [Модуль сертификации](https://github.com/AktivCo/certification-demo-module).

Для проверки электронной подписи применяется библиотека [Bouncy Castle Cryptography Library For .NET](https://github.com/bcgit/bc-csharp).

Взаимодействие с токеном в браузере обеспечивается следующими библиотеками:

- [Модуль для Рутокен плагин](https://github.com/AktivCo/rutoken-plugin-js);
- [Модуль инициализации Рутокен Плагин](https://github.com/AktivCo/rutoken-plugin-bootstrap).

Генерация ключевой пары выполняется по алгоритму <b>ГОСТ Р 34.10-2012 256-бит</b>.

Взаимодействие с модулем сертификации осуществляется через API.

Перед запуском необходимо указать соответствующий URL в разделе `CAConfig` файла `RutokenTotpFido2Demo/appsettings.json`.


## FIDO2

![Fido2 Architecture](https://developers.yubico.com/WebAuthn/WebAuthn_Developer_Guide/fido2_app_architecture.png?raw=true "Fido2 Architecture") 

В продукте реализованы следующие компоненты архитектуры FIDO2:

- Client-Side JS, Server-Side App & User Store;
- FIDO2 Server реализован с помощью библиотеки [Passwordless - FIDO2 for .NET](https://github.com/passwordless-lib/fido2-net-lib);
- Продукт позволяет осуществлять аутентификацию в режиме Passwordless, для этого устройство должно поддерживать [Режим верификации пользователя](https://developers.yubico.com/WebAuthn/WebAuthn_Developer_Guide/User_Presence_vs_User_Verification.html);
- PasswordLess аутентификация включается на сервере путем установки параметров.
    ```js
        var authenticatorSelection = new AuthenticatorSelection
        {
            RequireResidentKey = true,
            UserVerification = UserVerificationRequirement.Required
        };
    ```


## OTP

В продукте реализована двухфакторная аутентификация по протоколу TOTP (Time-based One-time Password) с помощью библиотеки [OTP .NET](https://github.com/kspearrin/Otp.NET).  
Сервер позволяет вводить seed (секретный) ключ в форматах Base32 или HEX. 


## Установка зависимостей и запуск сервиса

Для сборки и запуска веб-сервиса необходим установленный в системе [.NET SDK 6](https://dotnet.microsoft.com/en-us/download/dotnet/6.0).

Для сборки фронтенд части системы необходимо установить [Node.js](https://nodejs.org/ru) v18.0.0. Для переключения между версиями можно использовать NVM (Node Version Manager).

```sh
nvm install 18.0.0 # Если не была установлена версия ранее 

nvm use 18.0.0 # Если на текущий момент использовалась другая версия Node.js, но необходимая была установлена ранее
```

В качестве хранилища данных сервис использует СУБД PostgreSQL.  
`ConnectionString` к базе данных укажите в файле `RutokenTotpFido2Demo/appsettings.json`.

Сборка запускается следующей командой — `dotnet publish -c Release`.

### Запуск сервиса локально

Для запуска сервиса, необходимо в директории проекта выполнить следующие команды.

> __Linux__

- `cd bin/Release/net6.0/publish`
- `dotnet RutokenTotpFido2Demo.dll`

> __Windows__

- `cd bin\Release\net6.0\publish`
- `dotnet RutokenTotpFido2Demo.dll`

Перейдите по адресу https://localhost:5000 (адрес указан в консоли после запуска сервиса) для применения и функциональных возможностей устройств Рутокен MFA, Рутокен OTP и Рутокен ЭЦП 3.0 в сценариях двухэтапной и беспарольной аутентификации.

### Установка зависимостей и запуск сервиса в Docker

1. Для запуска в докер контейнере необходимо сконфигурировать `.env` файл в корневой директории проекта. Описание параметров представлено ниже в таблице.


    | Параметр           | Описание                  |
    | ---                | ---                       |
    | APP_CONTAINER_NAME | Имя контейнера приложения |
    | DESTINATION_FOLDER | Директория контейнера     |
    | APP_OUT_PORT       | Внешний порт приложения   |
    | DB_CONTAINER_NAME  | Имя контейнера БД         |
    | DB_NAME            | Наименование БД           |
    | DB_PORT            | Внешний порт БД           |
    | DB_PSWD            | Пароль пользователя БД    |
    | DB_USER            | Имя пользователя БД       |
    | DB_FOLDER          | Директория контейнера БД  |

    > Параметры `ConnectionString` в файле `RutokenTotpFido2Demo/appsettings.json` должны совпадать с параметрами, указанными в файле `.env`.
    > ```json
    > {
    >     "ConnectionStrings": {
    >         "Default": "Host=DB_CONTAINER_NAME;Port=DB_PORT;Database=DB_NAME;Username=DB_USER;Password=DB_PSWD"
    >     },
    > }
    > ```

2. Создать директории для контейнера базы данных и приложения.

    ```sh
    destinationFolder='/Users/my-user/ru-demo'
    
    mkdir -p ${destinationFolder}/app
    mkdir -p ${destinationFolder}/db
    ```

3. Перейти в директорию проекта "Рутокен 2FA Демо" (укажите вашу директорию).

    ```sh
    сd /Users/my-user/myproject/
    ```

4. Скопировать сборки и файлы docker.

    ```sh
    scp RutokenTotpFido2Demo/docker-compose.yml ${destinationFolder}
    scp RutokenTotpFido2Demo/.env ${destinationFolder}
    scp -r RutokenTotpFido2Demo/bin/Release/net6.0/publish/* ${destinationFolder}/app
    ```

6. Запустить контейнеры.

    ```sh
    docker compose -f ${destinationFolder}/docker-compose.yml up
    ```

7. После запуска контейнера перейти `http://localhost:APP_OUT_PORT`, где **APP_OUT_PORT** — параметр заданный в файле `.env` на первом шаге.