echo "Stopping gateway"
(cd gateway && docker-compose down)

echo "Stopping service-2"
(cd service-2 && docker-compose down)

echo "Stopping service-1"
(cd service-1 && docker-compose down)