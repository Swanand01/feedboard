from django.contrib import admin
from core.models import Post, Project, Category, ProjectAdmin, Comment, Status

# Register your models here.
admin.site.register(ProjectAdmin)
admin.site.register(Project)
admin.site.register(Post)
admin.site.register(Category)
admin.site.register(Comment)
admin.site.register(Status)
