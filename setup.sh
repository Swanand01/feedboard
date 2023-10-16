docker-compose exec web python manage.py migrate --no-input
docker-compose exec web python manage.py createsuperuser