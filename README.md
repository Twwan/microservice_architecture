# Лабораторная работа 6: Авторизация в микросервисном приложении

## Запуск

```bash
./run.sh
```

## Тестирование

### Авторизация

```bash
# 1. Регистрация пользователя
curl -X POST http://localhost/auth/register \
  -H "Content-Type: application/json" \
  -d '{"login":"testuser","password":"testpass"}'

# 2. Авторизация и получение токена
curl -X POST http://localhost/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"testuser","password":"testpass"}'
```

### Запросы к защищенным сервисам

```bash
# Запрос к service-1 с токеном (успешный)
curl http://localhost/service-1/?test=123 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Запрос к service-2 с токеном (успешный)
curl http://localhost/service-2/?test=777 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Запрос без токена (ошибка 401)
curl http://localhost/service-1/?test=123

# Запрос с невалидным токеном (ошибка 401)
curl http://localhost/service-1/?test=123 \
  -H "Authorization: Bearer INVALID_TOKEN"
```

## Просмотр логов

```bash
# Логи в Logstash
docker logs logstash -f
```

## Остановка

```bash
./stop.sh
```

## Архитектура

- **Gateway** (nginx) - маршрутизация запросов
- **Auth-Service** - микросервис авторизации (регистрация, логин, валидация токенов)
- **Service-1** - принимает запросы, отправляет в RabbitMQ (защищен авторизацией)
- **Service-2** - обрабатывает запросы напрямую (защищен авторизацией)
- **MQListener** - обрабатывает сообщения из RabbitMQ
- **Logstash** - централизованное хранение логов
- **RabbitMQ** - брокер сообщений
