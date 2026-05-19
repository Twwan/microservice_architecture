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


# Практическое занятие «Построение процесса непрерывной интеграции в Jenkins»

## Запуск Jenkins
```
docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home -v //var/run/docker.sock:/var/run/docker.sock jenkins/jenkins:lts
```

## Узнать начальный пароль админа
```
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Идём сюда: http://localhost:8080
Входим с полученным паролем
