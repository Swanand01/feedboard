# Generated by Django 4.0.2 on 2022-03-15 06:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_userinfo_date_time'),
    ]

    operations = [
        migrations.RenameField(
            model_name='userinfo',
            old_name='date_time',
            new_name='req_date',
        ),
    ]
