#!/bin/bash

echo "Dropping database..."

docker exec mysql-lab mysql -u root -padmin -e "DROP DATABASE IF EXISTS lab_database; CREATE DATABASE lab_database;"

if [ $? -eq 0 ]; then
    echo "Database dropped and recreated successfully!"
    echo "Restarting application..."
    docker restart lab-app
    sleep 3
    echo "Application restarted. Tables will be recreated automatically."
else
    echo "Database drop failed!"
    exit 1
fi

