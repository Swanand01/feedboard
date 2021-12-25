from django.db import models
from account.models import CustomUser
from django.db.models.signals import pre_save
from core.utils import unique_slug_generator
from django.urls import reverse


class Project(models.Model):
    title = models.TextField(default='New Project')
    description = models.TextField(default='', blank=True)
    slug = models.SlugField(max_length=250, blank=True)

    def __str__(self):
        return self.title

    def get_project_url(self):
        return reverse("project_view", kwargs={
            "project_slug": self.slug
        })


class ProjectAdmin(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.user_name


def save_title_slug(sender, instance, *args, **kwargs):
    if isinstance(instance, Category) or isinstance(instance, Post):
        instance.slug = unique_slug_generator(
            instance=instance, project=instance.project)
    else:
        instance.slug = unique_slug_generator(instance=instance)


pre_save.connect(save_title_slug, sender=Project)


class Category(models.Model):
    title = models.TextField(default='')
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    slug = models.SlugField(blank=True)

    def __str__(self):
        return self.title

    def get_category_url(self):
        return reverse("category_view", kwargs={
            "project_slug": self.project.slug,
            "category_slug": self.slug
        })


class Status(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    title = models.TextField(default='')
    is_default = models.BooleanField(default=False)
    colour = models.CharField(max_length=7, default="#808080")

    def __str__(self):
        return self.title


pre_save.connect(save_title_slug, sender=Category)


class Post(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    title = models.TextField(default='')
    content = models.TextField(default='')
    slug = models.SlugField(blank=True)
    upvotes = models.ManyToManyField(
        CustomUser, blank=True,  related_name="feature_upvotes")
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    status = models.ForeignKey(Status, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

    def get_upvotes(self):
        return self.upvotes.count()

    def get_post_url(self):
        return reverse("post_view", kwargs={
            "project_slug": self.project.slug,
            "category_slug": self.category.slug,
            "post_slug": self.slug
        })


pre_save.connect(save_title_slug, sender=Post)


class Comment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    post = models.ForeignKey(
        Post, related_name="comments", on_delete=models.CASCADE)
    content = models.TextField(default="")
    pub_date = models.DateTimeField(auto_now_add=True, blank=True)

    def __str__(self):
        return self.content
