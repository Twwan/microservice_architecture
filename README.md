# Лабораторная работа 7: Создание резервной копии базы данных

## Запуск

```bash
cd database-backup
docker-compose up -d
```

## Тестирование

### Просмотр логов
```bash
docker logs lab-app -f
```

### 1. Наполнение базы данных

```bash
bash populate_data.sh
curl http://localhost:3000/users
```

### 2. Создание резервной копии

```bash
bash backup.sh
```

### 3. Удаление базы данных

```bash
bash drop_database.sh
curl http://localhost:3000/users    # Должен вернуть []
```

### 4. Восстановление из резервной копии

```bash
bash restore.sh
curl http://localhost:3000/users    # Данные восстановлены
```

## Остановка

```bash
cd database-backup
docker-compose down
```
