echo "Stopping gateway"
(cd gateway && docker-compose down)

echo "Stopping service-2"
(cd service-2 && docker-compose down)

echo "Stopping service-1"
(cd service-1 && docker-compose down)

echo "Stopping auth-service"
(cd auth-service && docker-compose down)

echo "Stopping mqlistener"
(cd mqlistener && docker-compose down)

echo "Stopping logstash"
(cd logstash && docker-compose down)

echo "Stopping rabbitmq"
(cd rabbitmq && docker-compose down)
