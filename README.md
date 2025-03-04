# Neospiartion

Neospiartion - это социальная сеть для художников, где люди могут публиковать свои работы.

## Установка

1. Клонируйте репозиторий:
    ```sh
    git clone https://github.com/ваш-репозиторий.git
    ```
2. Перейдите в директорию проекта:
    ```sh
    cd neospiartion
    ```
3. Установите зависимости:
    ```sh
    dotnet restore
    ```

## Конфигурация

1. Настройте секреты пользователя для строки подключения к базе данных:
    ```sh
    dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Database=ArtsWarehouseDB;Username=postgres;Password=1"
    ```
2. Настройте секреты пользователя для параметров VK:
    ```sh
    dotnet user-secrets set "VK:ClientId" "ваш_client_id"
    dotnet user-secrets set "VK:RedirectUri" "https://localhost/login"
    ```

## Запуск

1. Запустите проект:
    ```sh
    dotnet run
    ```
2. Откройте браузер и перейдите по адресу `https://localhost:7154/swagger`, чтобы увидеть документацию API.

## Использование

### Импорт артов из VK

1. Получите URL для авторизации:
    ```sh
    GET /VK/authorizationUrl?codeVerifier=ваш_code_verifier&state=ваш_state
    ```
2. Аутентифицируйтесь и получите токен доступа:
    ```sh
    GET /VK/authenticate?uri=ваш_uri&codeVerifier=ваш_code_verifier
    ```
3. Импортируйте арты:
    ```sh
    GET /VK/exportArts?accessToken=ваш_access_token&ownerId=ваш_owner_id&artistId=ваш_artist_id
    ```

### Управление художниками

1. Создайте нового художника:
    ```sh
    POST /api/artists
    ```
    Тело запроса:
    ```json
    "имя_художника"
    ```

2. Получите список артов художника:
    ```sh
    GET /api/artists/{artistId}/arts
    ```
    Параметры:
    - `artistId`: ID художника
