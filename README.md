# Лабораторная работа 5: Работа с кластером

## Запуск

```bash
./swarm-init.sh
```

Скрипт выполнит:
- Инициализацию Docker Swarm (`docker swarm init`)
- Сборку образа сервиса
- Развертывание стека с 3 репликами (`docker service create`)

## Тестирование

### 1. Проверка кластера

```bash
# Список узлов кластера
docker node ls

# Список сервисов
docker service ls

# Детали сервиса и реплик
docker service ps lab5-cluster_service-2
```

### 2. Тестирование

```bash
# Несколько запросов
curl.exe http://localhost:3000/?test=1
curl.exe http://localhost:3000/?test=2
curl.exe http://localhost:3000/?test=3
```

Или открыть в браузере: `http://localhost:3000/?test=hello`

### 3. Логи реплик

```bash
docker service logs lab5-cluster_service-2
```

В логах видно, что запросы обрабатываются разными репликами (балансировка нагрузки).

### 4. Масштабирование

```bash
# Увеличить до 5 реплик
docker service scale lab5-cluster_service-2=5

# Проверить изменения
docker service ps lab5-cluster_service-2

# Вернуть 3 реплики
docker service scale lab5-cluster_service-2=3
```

### 5. Подключение второго узла (опционально)

Получить токен для подключения:

```bash
docker swarm join-token worker
```

На второй машине выполнить команду из вывода:

```bash
docker swarm join --token SWMTKN-1-xxxxx <IP>:2377
```

После подключения проверить узлы:

```bash
docker node ls
```

## Проверка статуса

```bash
./swarm-status.sh
```

## Остановка

```bash
./swarm-stop.sh
```

Или вручную:

```bash
docker stack rm lab5-cluster
docker swarm leave --force
```

## Основные команды Docker Swarm

| Команда | Описание |
|---------|----------|
| `docker swarm init` | Инициализировать кластер |
| `docker swarm join-token worker` | Получить токен для подключения |
| `docker node ls` | Список узлов кластера |
| `docker service ls` | Список сервисов |
| `docker service ps <service>` | Детали сервиса и реплик |
| `docker service logs <service>` | Логи сервиса |
| `docker service scale <service>=N` | Масштабирование |
| `docker stack deploy -c file.yml <name>` | Развернуть стек |
| `docker stack rm <name>` | Удалить стек |
