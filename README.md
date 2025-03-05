# Neospiartion

Neospiartion (ArtSite "кодовое имя") - это социальная сеть для художников, где люди могут публиковать свои работы.

## Функциональность

- [ ] Регестрировать аккаунты
- [ ] Загружать изображанения и опублкиовать их в качестве постов
- [ ] Создавать профиля художников
- [ ] Ставить пользователям отметки нравится на посты
- [ ] Заказывать у художников
- [ ] Возможность оставлять пожертвование
- [ ] Платные подписки (тиры), и посты в зависимости от подписок
- [ ] Совместные арты - один арт, но публикуются у несколько профилей
- [ ] Загрузков артов из других социальных сетей (ВК)

## Структура Базы Данных

```mermaid
erDiagram
    ACCOUNT ||--|{ ART-OWNERS : "owns"
    ACCOUNT {
        int id PK
        string email
        string password
        string name
        string description
        bool isVerified
        DateTime createdAt
    }
    ART ||--|{ ART-OWNERS : "is owner by"
    ART {
        int id PK
        string text
        DateTime createdAt
    }
    PICTURE }|--|| ART : added
    PICTURE {
        int id PK
        int artId FK
        string uri

    }
```

## Команда

Ветров Дмитрий - Backend-программист, Frontend-программист

Кривецкий Артемий - Backend-программист

Алиса Светова - Frontend-программист, художник
