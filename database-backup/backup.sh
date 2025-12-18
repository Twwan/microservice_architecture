#!/bin/bash

echo "Creating database backup..."

docker exec mysql-lab mysqldump -u admin -padmin lab_database > backup/dump.sql

if [ $? -eq 0 ]; then
    echo "Backup created successfully: backup/dump.sql"
    echo "Backup size: $(du -h backup/dump.sql | cut -f1)"
else
    echo "Backup failed!"
    exit 1
fi

