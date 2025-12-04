# Лабораторная работа 3: Очереди сообщений

## Запуск

```bash
./run.sh
```

## Тестирование

```bash
# Запрос к service-1 (с RabbitMQ)
curl http://localhost/service-1/?test=123

# Запрос к service-2
curl http://localhost/service-2/?test=777
```

## Остановка

```bash
./stop.sh
```

## Архитектура

- **Gateway** (nginx) - маршрутизация запросов
- **Service-1** - принимает запросы, отправляет в RabbitMQ
- **Service-2** - обрабатывает запросы напрямую
- **MQListener** - обрабатывает сообщения из RabbitMQ
- **RabbitMQ** - брокер сообщений
