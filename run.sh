echo "Build and start service-1"
(cd service-1 && docker-compose up -d --build)

echo "Build and start service-2"
(cd service-2 && docker-compose up -d --build)

echo "Build and start gateway"
(cd gateway && docker-compose up -d --build --force-recreate)