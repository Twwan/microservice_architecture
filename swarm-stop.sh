#!/bin/bash

echo "=== Остановка кластера ==="

# Удаление стека
docker stack rm lab5-cluster

echo "Ожидание завершения удаления сервисов..."
sleep 5

# Выход из Swarm
docker swarm leave --force

echo ""
echo "=== Кластер остановлен ==="

