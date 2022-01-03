from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib.auth.decorators import login_required
from django.urls.base import reverse
from core.models import Category, Project, ProjectAdmin, Post, Comment, Status
from account.models import CustomUser
import json


def project_view(request, project_slug):
    project = get_object_or_404(Project, slug=project_slug)
    categories = Category.objects.filter(project=project)
    context = {
        "project": project,
        "categories": categories
    }
    if request.user.is_authenticated:
        uname = str(request.user)
        user = CustomUser.objects.get(user_name=uname)
        if ProjectAdmin.objects.filter(project=project, user=user).exists():
            context["is_admin"] = True

    return render(request, 'project_view.html', context)


@login_required
def create_project(request):
    if request.user.is_superuser:
        uname = str(request.user)
        user = CustomUser.objects.get(user_name=uname)

        if request.method == 'POST':
            project_title = request.POST.get('project_title')
            project_description = request.POST.get('project_description')
            project = Project(title=project_title,
                              description=project_description)
            project.save()

            admin = ProjectAdmin(project=project, user=user)
            admin.save()

            categories = request.POST.getlist('category')
            for category in categories:
                if category != "":
                    c = Category(title=category, project=project)
                    c.save()
                    Status(category=c, title="Pending Review",
                           is_default=True).save()
                    Status(category=c, title="In Progress").save()
                    Status(category=c, title="Live").save()
            return redirect("project_view", project_slug=project.slug)

        return render(request, 'create_project.html')
    else:
        return HttpResponse("Unauthorised")


def category_view(request, project_slug, category_slug):
    project = Project.objects.get(slug=project_slug)
    category = Category.objects.get(project=project, slug=category_slug)
    posts = Post.objects.filter(category=category)

    if request.method == "POST":
        if request.user.is_authenticated:
            user = CustomUser.objects.get(user_name=str(request.user))
            post_title = request.POST.get('title')
            post_desc = request.POST.get('description')
            default_status = Status.objects.get(
                category=category, is_default=True)
            Post(user=user, project=project, category=category, title=post_title,
                 content=post_desc, status=default_status).save()
        else:
            return redirect(f"/login/?next={request.META.get('HTTP_REFERER')}")

    sort_by = request.GET.get("sort_by", "")
    if sort_by:
        posts = posts.order_by("-" + sort_by)

    filter_by = request.GET.get("filter_by", "")
    if filter_by:
        print("FILTERING...")
        print(filter_by)
        status = Status.objects.get(category=category, title=filter_by)
        posts = posts.filter(status=status)

    context = {
        'project': project,
        'category': category,
        'posts': posts,
    }

    if request.user.is_authenticated:
        uname = str(request.user)
        user = CustomUser.objects.get(user_name=uname)
        if ProjectAdmin.objects.filter(project=project, user=user).exists():
            context["is_admin"] = True

    return render(request, 'category_view.html', context)


def vote(request):
    if request.method == "POST":
        data = json.loads(request.body)
        if request.user.is_authenticated:
            user = CustomUser.objects.get(user_name=str(request.user))
            post_id = json.loads(request.body)['post_id']
            post = Post.objects.get(id=post_id)

            if user in post.upvotes.all():
                post.upvotes.remove(user)
            else:
                post.upvotes.add(user)

            return JsonResponse({
                'type': 'OK',
            })
        return JsonResponse({
            "type": "Redirect",
            "to_url": '/login/?next=%s' % data['to_url']
        })


def post_view(request, project_slug, category_slug, post_slug):
    project = Project.objects.get(slug=project_slug)
    post = Post.objects.get(project=project, slug=post_slug)
    statuses = post.category.status_set.all()
    comments = Comment.objects.filter(post=post).order_by("-pub_date")
    voters = post.upvotes.all()
    context = {
        "project": project,
        "post": post,
        "comments": comments,
        "voters": voters,
        "statuses": statuses
    }
    if request.user.is_authenticated:
        uname = str(request.user)
        user = CustomUser.objects.get(user_name=uname)
        if ProjectAdmin.objects.filter(project=project, user=user).exists():
            context["is_admin"] = True

        if request.method == "POST":
            status = Status.objects.get(
                category=post.category, title=request.POST.get("status"))

            Post.objects.filter(
                project=project, slug=post_slug).update(status=status)
            return redirect(post.get_post_url())

    return render(request, "post_view.html", context)


@login_required
def edit_post(request, post_id):
    post = Post.objects.get(id=post_id)
    if post.user == request.user:
        if request.method == "POST":
            post_title = request.POST.get("title")
            post_desc = request.POST.get("description")
            post.title = post_title
            post.content = post_desc
            post.save()
            return redirect(post.get_post_url())
        return render(request, "edit_post.html", context={"post": post})
    else:
        return HttpResponse("Unauthorised")


@login_required
def delete_post(request, post_id):
    uname = str(request.user)
    user = CustomUser.objects.get(user_name=uname)

    post = Post.objects.get(id=post_id)
    category_url = post.category.get_category_url()
    if post.user == request.user or ProjectAdmin.objects.filter(project=post.project, user=user).exists():
        post.delete()
    return redirect(category_url)


def add_comment(request):
    if request.user.is_authenticated:
        if request.method == "POST":
            user = CustomUser.objects.get(user_name=str(request.user))
            post = Post.objects.get(id=request.POST.get('post_id'))
            content = request.POST.get('comment_input')
            comment = Comment(post=post, user=user, content=content)
            comment.save()
        return redirect(post.get_post_url())
    else:
        return redirect(f"/login/?next={request.META.get('HTTP_REFERER')}")


def project_settings(request, project_slug):
    project = Project.objects.get(slug=project_slug)
    user = CustomUser.objects.get(user_name=str(request.user))
    if ProjectAdmin.objects.filter(project=project, user=user).exists():
        admins = ProjectAdmin.objects.filter(project=project)
        context = {
            "project": project,
            "admins": admins
        }
        if request.method == "POST":
            if "project_name_change" in request.POST:
                if project.title != request.POST.get("project_name"):
                    project.title = request.POST.get("project_name")
                    project.save()
                    return redirect(reverse("project_settings", kwargs={
                        "project_slug": project.slug
                    }))
            elif "new_category" in request.POST:
                for category in request.POST.getlist("new_category"):
                    if category != "":
                        c = Category(title=category, project=project)
                        c.save()
                        Status(category=c, title="Pending Review",
                               is_default=True).save()
                        Status(category=c, title="In Progress").save()
                        Status(category=c, title="Live").save()
            elif "delete_project" in request.POST:
                project.delete()
                return redirect("/app")

        return render(request, "project_settings.html", context)
    else:
        return HttpResponse("Unauthorised")


def board_settings(request, project_slug, category_slug):
    project = Project.objects.get(slug=project_slug)
    category = Category.objects.get(project=project, slug=category_slug)
    user = CustomUser.objects.get(user_name=str(request.user))
    if ProjectAdmin.objects.filter(project=project, user=user).exists():
        context = {
            "project": project,
            "category": category
        }

        if request.method == "POST":
            if "board_name_change" in request.POST:
                if category.title != request.POST.get("category_name"):
                    category.title = request.POST.get("category_name")
                    category.save()
                    return redirect(reverse("board_settings", kwargs={
                        "project_slug": project.slug,
                        "category_slug": category.slug
                    }))

            elif "delete_board" in request.POST:
                category.delete()
                return redirect(project.get_project_url())

            elif request.body:
                data = json.loads(request.body)
                if "type" in data.keys() and data["type"] == "status_change":
                    statuses = data["statuses"]
                    for status_id in statuses.keys():
                        status = Status.objects.get(id=status_id)
                        colour = statuses[status_id]['colour']
                        status.title = statuses[status_id]['title']
                        status.colour = colour
                        status.save()

                    new_statuses = data["new_statuses"]
                    print(new_statuses)
                    for new_status in new_statuses:
                        status = Status(category=category,
                                        title=new_status)
                        status.save()

        return render(request, "board_settings.html", context)
    else:
        return HttpResponse("Unauthorised")


def search_posts(request):
    if request.method == "POST":
        if request.body:
            uname = str(request.user)
            user = CustomUser.objects.get(user_name=uname)

            data = json.loads(request.body)
            category = Category.objects.get(pk=data["category_id"])
            project = category.project
            search_query = data["search_query"]

            context = {
                "posts": {}
            }

            posts = Post.objects.filter(
                category=category, title__icontains=search_query)
            if ProjectAdmin.objects.filter(user=user).exists():
                context["is_admin"] = True

            for post in posts:
                post_id = post.id
                post_title = post.title
                post_desc = post.content
                post_status = post.status.title
                post_url = post.get_post_url()
                edit_post_url = reverse("edit_post", kwargs={
                    "post_id": post_id
                })
                delete_post_url = reverse("delete_post", kwargs={
                    "post_id": post_id
                })
                creator = post.user.user_name
                upvotes = post.get_upvotes()
                comments = post.comments.count()
                context["posts"][post_id] = {
                    "title": post_title,
                    "description": post_desc,
                    "status": post_status,
                    "status_colour": post.status.colour,
                    "post_url": post_url,
                    "edit_post_url": edit_post_url,
                    "delete_post_url": delete_post_url,
                    "creator": creator,
                    "user_is_creator": request.user.user_name == creator,
                    "has_upvoted": request.user in post.upvotes.all(),
                    "upvotes": upvotes,
                    "comments": comments
                }
            return JsonResponse(context)


def delete_status(request):
    if request.method == "POST":
        user = CustomUser.objects.get(user_name=str(request.user))
        data = json.loads(request.body)
        status_id = data["status_id"]
        status = Status.objects.get(pk=status_id)
        category = status.category
        if ProjectAdmin.objects.filter(project=category.project, user=user).exists():
            posts = Post.objects.filter(category=category, status=status)
            default_status = Status.objects.get(
                category=category, is_default=True)

            posts.update(status=default_status)
            status.delete()
            return JsonResponse({"Status": "OK"})
        else:
            return HttpResponse("Unauthorised")


def me(request):
    context = {
        "projects": []
    }
    if request.user.is_authenticated:
        uname = str(request.user)
        user = CustomUser.objects.get(user_name=uname)
        if ProjectAdmin.objects.filter(user=user).exists():
            context["is_admin"] = True
            projects = ProjectAdmin.objects.filter(user=user).values('project')
            for project in projects:
                p = Project.objects.get(pk=project["project"])
                context["projects"].append(
                    {
                        "title": p.title,
                        "url": p.get_project_url()
                    }
                )
    return render(request, "me.html", context)
