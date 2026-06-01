# Лабораторная 2.4 — Развёртывание в Kubernetes

**Ветка:** `UIiRPS_lab4`

Микросервисы `service-1`, `service-2` и `gateway` (nginx) разворачиваются в minikube через `kubectl`. Доступ с хоста — через `minikube service`.

## Структура

```text
service-1/          Node.js, порт 3000
service-2/          Node.js, порт 3001
gateway/            nginx, маршруты /api/service-1/, /api/service-2/
```

## Архитектура

```text
curl / браузер
  → minikube service (127.0.0.1:ПОРТ)
  → gateway (nginx:80)
  → service-1:3000  |  service-2:3001
```

Имена deployment и Service в кластере (`service-1`, `service-2`) совпадают с хостами в `gateway/nginx.conf`.

## Перед запуском

Должны быть установлены и работать: **Docker Desktop**, **minikube**, **kubectl**.  
Docker Desktop запущен (Engine running).

---

## Запуск с нуля (PowerShell)

### 1. Кластер

```powershell
minikube start --driver=docker
kubectl get nodes
```

### 2. Сборка образов в Docker minikube

```powershell
& minikube -p minikube docker-env --shell powershell | Invoke-Expression

cd "D:\Универ\_Магистратура\МА\labs"

docker build -t microservice-service-1:latest .\service-1
docker build -t microservice-service-2:latest .\service-2
docker build -t microservice-gateway:latest .\gateway
```

> Путь `cd` замени на свой, если репозиторий лежит в другом месте.

### 3. Очистка старых ресурсов (если перезапускаешь)

```powershell
kubectl delete deployment service-1 service-2 gateway --ignore-not-found
kubectl delete service service-1 service-2 gateway --ignore-not-found
```

### 4. Развёртывание

```powershell
kubectl create deployment service-1 --image=microservice-service-1:latest
kubectl patch deployment service-1 -p '{"spec":{"template":{"spec":{"containers":[{"name":"service-1","imagePullPolicy":"IfNotPresent"}]}}}}'
kubectl expose deployment service-1 --type=NodePort --port=3000

kubectl create deployment service-2 --image=microservice-service-2:latest
kubectl patch deployment service-2 -p '{"spec":{"template":{"spec":{"containers":[{"name":"service-2","imagePullPolicy":"IfNotPresent"}]}}}}'
kubectl expose deployment service-2 --type=NodePort --port=3001

kubectl create deployment gateway --image=microservice-gateway:latest
kubectl patch deployment gateway -p '{"spec":{"template":{"spec":{"containers":[{"name":"gateway","imagePullPolicy":"IfNotPresent"}]}}}}'
kubectl expose deployment gateway --type=NodePort --port=80
```

### 5. Проверка подов

```powershell
kubectl get pod
kubectl get svc
```

Все поды в статусе `Running`, `READY 1/1`.

```powershell
kubectl logs deployment/service-1 --tail=5
kubectl logs deployment/service-2 --tail=5
```

В логах должно быть: `APP STARTED`.

---

## Доступ к сервисам

**Окно 1** — оставить открытым на всё время работы:

```powershell
minikube service gateway --url
```

Пример вывода: `http://127.0.0.1:5118`

**Окно 2** — проверка (подставь свой порт):

```powershell
$url = "http://127.0.0.1:5118"

curl.exe "$url/api/service-1/?test=123"
curl.exe "$url/api/service-2/?test=777"
```

Пустой ответ без `502` — нормально. Запросы видны в логах:

```powershell
kubectl logs deployment/service-1 --tail=3
kubectl logs deployment/service-2 --tail=3
```

Проверка изнутри кластера:

```powershell
kubectl exec deployment/gateway -- wget -qO- "http://service-1:3000/?test=1"
```

---

## Сдача / демонстрация преподавателю

```powershell
kubectl get pod
kubectl get svc
minikube service gateway --url
curl.exe "http://127.0.0.1:ПОРТ/api/service-1/?test=123"
curl.exe "http://127.0.0.1:ПОРТ/api/service-2/?test=777"
kubectl logs deployment/service-1 --tail=5
```

Окно с `minikube service gateway --url` не закрывать — иначе URL перестанет открываться.

Корень `http://127.0.0.1:ПОРТ/` может отдавать 404 — используй только `/api/service-1/` и `/api/service-2/`.

---

## Публикация образов на GHCR (опционально)

```powershell
$token = "GITHUB_TOKEN"
$token | docker login ghcr.io -u Twwan --password-stdin

cd "D:\Универ\_Магистратура\МА\labs"

docker build -t ghcr.io/twwan/microservice_architecture-service-1:latest .\service-1
docker build -t ghcr.io/twwan/microservice_architecture-service-2:latest .\service-2
docker build -t ghcr.io/twwan/microservice_architecture-gateway:latest .\gateway

docker push ghcr.io/twwan/microservice_architecture-service-1:latest
docker push ghcr.io/twwan/microservice_architecture-service-2:latest
docker push ghcr.io/twwan/microservice_architecture-gateway:latest
```

Пакеты на GitHub → **Packages** сделать **Public**.

Деплой из registry:

```powershell
kubectl create deployment service-1 --image=ghcr.io/twwan/microservice_architecture-service-1:latest
kubectl expose deployment service-1 --type=NodePort --port=3000

kubectl create deployment service-2 --image=ghcr.io/twwan/microservice_architecture-service-2:latest
kubectl expose deployment service-2 --type=NodePort --port=3001

kubectl create deployment gateway --image=ghcr.io/twwan/microservice_architecture-gateway:latest
kubectl expose deployment gateway --type=NodePort --port=80

kubectl rollout restart deployment/service-1 deployment/service-2 deployment/gateway
```

---

## Остановка

Закрыть окно с `minikube service`.

```powershell
kubectl delete deployment service-1 service-2 gateway
kubectl delete service service-1 service-2 gateway

minikube stop
```

Полная очистка кластера:

```powershell
minikube delete
```

---

## Частые проблемы

| Симптом | Решение |
|---------|---------|
| `502 Bad Gateway` | Пересобрать образы service-1/2 (в Dockerfile должен быть `CMD ["npm", "start"]`), `kubectl rollout restart` |
| Пустые логи service-1 | Образ без `CMD` — приложение не слушает порт |
| URL не открывается | Окно `minikube service gateway --url` закрыто |
| `ImagePullBackOff` | Для GHCR: пакет Public; для local: `imagePullPolicy: IfNotPresent` и сборка через `minikube docker-env` |
