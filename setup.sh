#!/bin/bash

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
        sleep 0.1
    done

    echo "PostgreSQL started"
fi

# Run migrations in the background
python manage.py migrate --no-input &

# Wait for the migrate process to finish
while ! python manage.py migrate | grep "No migrations to apply"; do
    sleep 1
done

python manage.py createsuperuser --no-input
gunicorn feedboard.wsgi:application --bind 0.0.0.0:8000