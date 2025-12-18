#!/bin/bash

echo "=== Статус кластера Docker Swarm ==="
echo ""

echo "Узлы кластера:"
docker node ls
echo ""

echo "Сервисы:"
docker service ls
echo ""

echo "Детали сервиса service-2:"
docker service ps lab5-cluster_service-2
echo ""

echo "Логи сервиса:"
docker service logs lab5-cluster_service-2 --tail 20

