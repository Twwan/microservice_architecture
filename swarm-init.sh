#!/bin/bash

echo "=== Инициализация Docker Swarm ==="

# Инициализация Swarm
docker swarm init

echo ""
echo "=== Сборка образа сервиса ==="
cd service-2
docker build -t service-2:latest .
cd ..

echo ""
echo "=== Развертывание стека в Swarm ==="
docker stack deploy -c docker-compose.swarm.yml lab5-cluster

echo ""
echo "=== Информация о кластере ==="
echo "Узлы кластера:"
docker node ls

echo ""
echo "Сервисы в кластере:"
docker service ls

echo ""
echo "Задачи сервиса:"
docker service ps lab5-cluster_service-2

echo ""
echo "=== Кластер успешно инициализирован ==="
echo "Для подключения другого узла используйте команду:"
docker swarm join-token worker

