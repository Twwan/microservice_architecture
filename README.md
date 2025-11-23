# Лабораторная работа 2: Настройка Gateway

## Запуск

```bash
./run.sh
```

## Тестирование

```bash
# Запрос к service-1
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
- **Service-1** - сервис 1
- **Service-2** - сервис 2
