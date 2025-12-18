#!/bin/bash

if [ ! -f backup/dump.sql ]; then
    echo "Error: backup/dump.sql not found!"
    exit 1
fi

echo "Restoring database from backup..."

docker exec -i mysql-lab mysql -u admin -padmin lab_database < backup/dump.sql

if [ $? -eq 0 ]; then
    echo "Database restored successfully!"
else
    echo "Restore failed!"
    exit 1
fi

